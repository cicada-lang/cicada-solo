const util = require("util")
const child_process = require("child_process")
const exec = util.promisify(child_process.exec)

module.exports = exec
