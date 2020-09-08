async function run(dev) {
  if (process.argv.length <= 2) {
    console.log("commands:")
    for (const name of Object.keys(dev)) console.log(`- ${name}`)
  }

  const commands = process.argv.slice(2)
  for (const command of commands) await dev[command]()
}

process.on("unhandledRejection", (error) => {
  console.error(error)
  process.exit(1)
})

module.exports = run
