const yargs = require("yargs")

const usage = `
╭━━━╮╱╱╱╭━━━━╮╱╱╱╱╭╮
┃╭━╮┃╱╱╱┃╭╮╭╮┃╱╱╱╱┃┃
┃╰━╯┣━━┳┻┫┃┃┣┻━┳━━┫╰━╮
┃╭━━┫╭╮┃╭╯┃┃┃┃━┫╭━┫╭╮┃
┃┃╱╱┃╭╮┃┃╱┃┃┃┃━┫╰━┫┃┃┃
╰╯╱╱╰╯╰┻╯╱╰╯╰━━┻━━┻╯╰╯
`

export async function run(): Promise<void> {
  yargs.commandDir("commands").demandCommand().usage(usage).strict().parse()
}
