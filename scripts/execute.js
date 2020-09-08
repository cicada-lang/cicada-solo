const util = require("util")
const child_process = require("child_process")
const exec = util.promisify(child_process.exec)

// NOTE
// - docs: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback

async function execute(command) {
  try {
    const { stdout, stderr } = await exec(command)
    return { stdout, stderr }
  } catch (error) {
    return { error, stdout: error.stdout, stderr: error.stderr }
  }
}

module.exports = execute
