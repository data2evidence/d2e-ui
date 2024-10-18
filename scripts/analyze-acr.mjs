#!/usr/bin/env zx
// https://github.com/marketplace/actions/run-zx
// https://google.github.io/zx/faq#using-github-actions

const azRegManifestsOrigYmlFile = "private-manifests-orig.json"
const azRegManifestsProcessedYmlFile = "private-manifests-analyzed.yml"
const manifestsDeleteShFile = "private-manifests-delete.sh"

const daysAgo = n => {
	let d = new Date();
	d.setDate(d.getDate() - Math.abs(n));
	return d;
};

const includesAny = (arr, values) => values.some(v => arr.includes(v));

const azRegPruneTimestamp = daysAgo(process.env.AZ_REG_PRUNE_DAYS).toISOString()

let manifestsStr = ''
if (fs.existsSync(azRegManifestsOrigYmlFile)) {
	// during development avoid expensive call to manifest list-metadata
	manifestsStr = fs.readFileSync(azRegManifestsOrigYmlFile, 'utf8');
} else {
	manifestsStr = await $`az acr manifest list-metadata --only-show-errors --name $AZ_REG_REPOSITORY --registry $AZ_REG_NAME --username "$AZ_REG_USERNAME" --password "$AZ_REG_PASSWORD" --orderby time_asc --query "[?lastUpdateTime < '${azRegPruneTimestamp}']"`
	fs.writeFileSync(azRegManifestsOrigYmlFile, manifestsStr.stdout, (err) => {
		console.log(`ERROR writing ${azRegManifestsYml} with ${err}`);
	})
}

const manifests = JSON.parse(manifestsStr)
const manifestsTagged = manifests.filter(e => e.tags)
// console.log(YAML.stringify(manifestsTagged))
// manifests.map(e => e.tags)

const regEx = new RegExp(process.env.AZ_REG_WHITELIST_REGEX);
const keepTags = manifestsTagged.flatMap(e => e.tags).filter(e => e.match(regEx)).sort()
const keepManifests = manifestsTagged.filter(e => includesAny(e.tags, keepTags))
const keepDigests = keepManifests.flatMap(keepDigest => keepDigest.digest)

echo(`keepTags:\n${YAML.stringify(keepTags)}\n`)
echo(`keepDigests: \n${YAML.stringify(keepDigests)}\n`)

const showMetadatas = await Promise.all(keepManifests.map(async keepManifest => {
	// showMetadata = await
	const showMetadata = await $`az acr manifest show-metadata $AZ_REG_FQDN/$AZ_REG_REPOSITORY@${keepManifest.digest} --only-show-errors --username "$AZ_REG_USERNAME" --password "$AZ_REG_PASSWORD"`
	if (typeof showMetadata == 'undefined') {
		echo(`az acr manifest show - metadata $AZ_REG_FQDN / $AZ_REG_REPOSITORY@${keepManifest.digest} --only -show- errors --username "$AZ_REG_USERNAME" --password "$AZ_REG_PASSWORD"`)
		throw new Error(`showMetadata command failed`);
	} else {
		return JSON.parse(showMetadata)
	}
}))

const referencedDigests = showMetadatas.flatMap(e => e.references).map(e => e.digest)

// manifest = manifests[manifests.length - 1] // debug
const analyzedManifests = manifests.map(manifest => {
	if (includesAny(manifest.digest, [...referencedDigests, ...keepDigests])) {
		manifest.keep = true
	} else {
		manifest.keep = false
	}
	const showMetadata = showMetadatas.filter(e => e.digest === manifest.digest)
	if ((typeof showMetadata !== 'undefined') && (showMetadata.length != 0)) {
		if (showMetadata.length != 0) {
			manifest.references = showMetadata[0].references
		}
	}
	return manifest
})


const analyzedManifestsYmlStr = YAML.stringify(analyzedManifests)
fs.writeFileSync(azRegManifestsProcessedYmlFile, YAML.stringify(analyzedManifests), (err) => {
	throw new Error(`writing ${azRegManifestsProcessedYmlFile} failed with ${err} `);
})
echo(`analyzedManifestsYmlStr: \n${analyzedManifestsYmlStr} `)

// m = analyzedManifests[analyzedManifests.length - 1]
// m.tags

const commands = analyzedManifests.filter(m => m.keep == false).map(m => {
	return `az acr repository delete -u $AZ_REG_USERNAME -p $AZ_REG_PASSWORD --name $AZ_REG_NAME --image $AZ_REG_REPOSITORY@${m.digest} --yes # tags: ${m.tags} `
})

if (commands.length > 0) {
	const commandsStr = `set -o xtrace\n${commands.slice(0, 1).join("\n")}`
	fs.writeFileSync(manifestsDeleteShFile, commandsStr, (err) => {
		throw new Error(`writing ${manifestsDeleteShFile} failed with ${err} `);
	})
	echo(`Commands:\n${commandsStr}\n`)
}
