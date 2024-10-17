#!/usr/bin/env zx
// https://github.com/marketplace/actions/run-zx
// https://google.github.io/zx/faq#using-github-actions
$.verbose = 2; // default; prints all output
// $.verbose = 1; // prints commands only
let manifestsListFile = "private-manifests-list.yaml"
let manifestsAnalyzedFile = "private-manifests-analyzed.yml"

const daysAgo = n => {
	let d = new Date();
	d.setDate(d.getDate() - Math.abs(n));
	return d;
};

const includesAny = (arr, values) => values.some(v => arr.includes(v));

azRegPruneTimestamp = daysAgo(process.env.AZ_REG_PRUNE_DAYS).toISOString()

echo(". 1 - GET manifest metadata")
const manifestsStr = await $`az acr manifest list-metadata --only-show-errors --name $AZ_REG_REPOSITORY --registry $AZ_REG_NAME --username "$AZ_REG_USERNAME" --password "$AZ_REG_PASSWORD" --orderby time_asc --query "[?lastUpdateTime < '${azRegPruneTimestamp}']"`

const manifests = JSON.parse(manifestsStr)
const manifestsTagged = manifests.filter(e => e.tags)
console.log(manifests.map(e => e.tags).stringify())

const regex = new RegExp(process.env.AZ_REG_WHITELIST_REGEX);
const whitelistTags = manifestsTagged.flatMap(e => e.tags).filter(e => e.match(regex)).sort()
const whitelistManifests = manifestsTagged.filter(e => includesAny(e.tags, whitelistTags))
const whitelistDigests = whitelistManifests.flatMap(whitelistDigest => whitelistDigest.digest)

const showMetadatas = await Promise.all(whitelistManifests.map(async whitelistManifest => {
	showMetadata = await $`az acr manifest show-metadata $AZ_REG_FQDN/$AZ_REG_REPOSITORY@${whitelistManifest.digest} --only-show-errors --username "$AZ_REG_USERNAME" --password "$AZ_REG_PASSWORD"`
	return JSON.parse(showMetadata)
}))


const referencedDigests = showMetadatas.flatMap(e => e.references).map(e => e.digest)

// manifest = manifests[manifests.length - 1] // debug
analyzedManifests = manifests.map(manifest => {
	if (includesAny(manifest.digest, [...referencedDigests, ...whitelistDigests])) {
		manifest.whitelist = true
	}
	showMetadata = showMetadatas.filter(showMetadata => showMetadata.digest === manifest.digest)
	if (showMetadata.length != 0) {
		manifest.references = showMetadata[0].references
	}
	return manifest
})

fs.writeFileSync(manifestsAnalyzedFile, YAML.stringify(analyzedManifests), (err) => {
	console.log(`ERROR writing ${manifestsAnalyzedFile} with ${err}`);
})

// await $`code ${manifestsAnalyzedFile}`