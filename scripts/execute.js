const util = require("util")
const child_process = require("child_process")
const exec = util.promisify(child_process.exec)

// NOTE
// - docs: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback

async function execute(command) {
  const t0 = Date.now()
  try {
    const { stdout, stderr } = await exec(command)
    const t1 = Date.now()
    const elapse = t1 - t0
    return { stdout, stderr, elapse }
  } catch (error) {
    const t1 = Date.now()
    const elapse = t1 - t0
    const { stdout, stderr } = error
    return { stdout, stderr, elapse, error }
  }
}

module.exports = execute
