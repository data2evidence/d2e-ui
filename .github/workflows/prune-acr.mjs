#!/usr/bin/env zx
// https://github.com/marketplace/actions/run-zx
// https://google.github.io/zx/faq#using-github-actions
// $.verbose = 1; // prints commands only
// $.verbose = 2; // default; prints all output

const daysAgo = n => {
	let d = new Date();
	d.setDate(d.getDate() - Math.abs(n));
	return d;
};

const includesAny = (arr, values) => values.some(v => arr.includes(v));

const azRegPruneTimestamp = daysAgo(process.env.AZ_REG_PRUNE_DAYS).toISOString()

const azRegManifestsOrigYml = "private-manifests.json"
let manifestsStr = ''
if (fs.existsSync(azRegManifestsOrigYml)) {
	manifestsStr = fs.readFileSync(azRegManifestsOrigYml, 'utf8');
} else {
	manifestsStr = await $`az acr manifest list-metadata --only-show-errors --name $AZ_REG_REPOSITORY --registry $AZ_REG_NAME --username "$AZ_REG_USERNAME" --password "$AZ_REG_PASSWORD" --orderby time_asc --query "[?lastUpdateTime < '${azRegPruneTimestamp}']"`
	fs.writeFileSync(azRegManifestsOrigYml, manifestsStr.stdout, (err) => {
		console.log(`ERROR writing ${azRegManifestsYml} with ${err}`);
	})
}

const manifests = JSON.parse(manifestsStr)
const manifestsTagged = manifests.filter(e => e.tags)
// console.log(YAML.stringify(manifestsTagged))
// manifests.map(e => e.tags)

const regex = new RegExp(process.env.AZ_REG_WHITELIST_REGEX);
const whitelistTags = manifestsTagged.flatMap(e => e.tags).filter(e => e.match(regex)).sort()
const whitelistManifests = manifestsTagged.filter(e => includesAny(e.tags, whitelistTags))
const whitelistDigests = whitelistManifests.flatMap(whitelistDigest => whitelistDigest.digest)

const showMetadatas = await Promise.all(whitelistManifests.map(async whitelistManifest => {
	// showMetadata = await
	const showMetadata = await $`az acr manifest show-metadata $AZ_REG_FQDN/$AZ_REG_REPOSITORY@${whitelistManifest.digest} --only-show-errors --username "$AZ_REG_USERNAME" --password "$AZ_REG_PASSWORD"`
	if (typeof showMetadata == 'undefined') {
		echo`az acr manifest show-metadata $AZ_REG_FQDN/$AZ_REG_REPOSITORY@${whitelistManifest.digest} --only-show-errors --username "$AZ_REG_USERNAME" --password "$AZ_REG_PASSWORD"`
		throw new Error('showMetadata failed');
	} else {
		return JSON.parse(showMetadata)
	}
}))

const referencedDigests = showMetadatas.flatMap(e => e.references).map(e => e.digest)

// manifest = manifests[manifests.length - 1] // debug
const analyzedManifests = manifests.map(manifest => {
	if (includesAny(manifest.digest, [...referencedDigests, ...whitelistDigests])) {
		manifest.whitelist = true
	}
	const showMetadata = showMetadatas.filter(showMetadata => showMetadata.digest === manifest.digest)
	if ((typeof showMetadata !== 'undefined') && (showMetadata.length != 0)) {
		if (showMetadata.length != 0) {
			manifest.references = showMetadata[0].references
		}
		return manifest
	}
})

const azRegManifestsYml = process.env.AZ_REG_MANIFESTS_YML
const analyzedManifestsYAML = YAML.stringify(analyzedManifests)
fs.writeFileSync(azRegManifestsYml, analyzedManifestsYAML, (err) => {
	throw new Error(`writing ${azRegManifestsYml} with ${err}`);
})
echo(analyzedManifestsYAML)

// await $`code ${azRegManifestsYml}`
