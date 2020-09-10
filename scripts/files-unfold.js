const fg = require("fast-glob")
const util = require("util")

async function files_unfold(files) {
  if (typeof files === "string") {
    const unfolded = []
    const glob = files
    for (const file of await fg(glob)) {
      unfolded.push(file)
    }
    return unfolded
  } else if (files instanceof Array) {
    const unfolded = []
    for (const glob of files) {
      for (const file of await fg(glob)) {
        unfolded.push(file)
      }
    }
    return unfolded
  } else {
    throw new Error(`wrong argument type: ${util.inspect(files, false, null, true)}`)
  }
}

module.exports = files_unfold
