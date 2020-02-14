function increasePatchVersion(org) {
	const comp = org.split(`.`)
	comp[comp.length - 1] = comp[comp.length - 1] * 1 + 1
	return comp.join(`.`)
}

const fs = require(`fs`)
const archiver = require(`archiver`)

// check folder
const dir = `${__dirname }/zip`
if (!fs.existsSync(dir)){
	fs.mkdirSync(dir)
}

// zip the output for distribution
const manifest = JSON.parse(fs.readFileSync(`src/manifest.json`))
const messages = JSON.parse(fs.readFileSync(`src/_locales/en/messages.json`)) || {}

const key = manifest.name.includes(`__`) ? manifest.name.replace(/__/g, ``).replace(`MSG_`, ``) : null
const name = (key ? messages[key].message : manifest.name).replace(/ /g, `_`)

const version = increasePatchVersion(manifest.version)
manifest.version = version
fs.writeFileSync(`src/manifest.json`, JSON.stringify(manifest, null, 4), `utf8`)
fs.writeFileSync(`dist/manifest.json`, JSON.stringify(manifest, null, 4), `utf8`)

const filename = `zip/${ name }_v${ version }.zip`
const output = fs.createWriteStream(filename)
const archive = archiver(`zip`, {
	zlib: { level: 9 }, // Sets the compression level.
})

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on(`close`, () => {
	console.info(`Archived completed: ${ filename}`)
	console.info(`(${ archive.pointer() } total bytes)`)

})

// pipe archive data to the file
archive.pipe(output)

// append files from a sub-directory, putting its contents at the root of archive
archive.directory(`dist/`, false)

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize()
