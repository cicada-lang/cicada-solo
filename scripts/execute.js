const util = require("util")
const child_process = require("child_process")
const exec = util.promisify(child_process.exec)

// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback

function execute(command) {
  return exec(command)
    .then(({ stdout, stderr }) => ({ stdout, stderr }))
    .catch((error) => ({ error, stdout: error.stdout, stderr: error.stderr }))
}

module.exports = execute
