import { Command } from "../../infra/command"
import { CommandRunner } from "../../infra/command-runner"
import { Library } from "../../library"
import * as ModuleLoaders from "../../module-loaders"
import * as Runners from "../../runners"
import app from "../../app/node-app"
import ty from "@xieyuheng/ty"
import watcher from "node-watch"
import Colors from "Colors"
import fs from "fs"

type Args = { library?: string }
type Opts = { watch?: boolean }

export class CheckCommand extends Command<Args, Opts> {
  name = "check"

  description = "Check a library -- by cwd, dir or library.json"

  args = { library: ty.optional(ty.string()) }
  opts = { watch: ty.optional(ty.boolean()) }

  help(runner: CommandRunner): string {
    const name = Colors.blue(this.name)

    return [
      `The ${name} command checks a library.`,
      ``,
      `You can specify a library by a path to its library.json config file,`,
      `or a path to a directory which contains the config file,`,
      `and if no path are given, the current working directory will be used.`,
      ``,
      Colors.blue(`  ${runner.name} check libraries/cicada-stdlib`),
      Colors.blue(
        `  ${runner.name} check libraries/cicada-stdlib/library.json`
      ),
      Colors.blue(`  ${runner.name} check libraries/the-little-typer --watch`),
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const path = argv["library"] || process.cwd() + "/library.json"
    Command.assertExists(path)
    const config_file = fs.lstatSync(path).isFile()
      ? path
      : path + "/library.json"
    const library = await app.libraries.get(config_file)

    app.logger.info(library.config)

    if (argv["watch"]) {
      await check(library)
      app.logger.info(`Initial check complete, now watching for changes.`)
      await watch(library)
    } else {
      const { errors } = await check(library)
      if (errors.length > 0) {
        process.exit()
      }
    }
  }
}

async function check(library: Library): Promise<{ errors: Array<unknown> }> {
  let errors: Array<unknown> = []

  for (const path of Object.keys(await library.files.all())) {
    if (ModuleLoaders.can_handle_extension(path)) {
      const runner = app.createSpecialRunner({ path, library })
      const { error } = await runner.run(path)
      if (error) errors.push(error)

      if (error) {
        app.logger.error(`(check) ${path}`)
      } else {
        app.logger.info(`(check) ${path}`)
      }
    }
  }

  return { errors }
}

async function watch(library: Library): Promise<void> {
  const dir = library.files.root

  watcher(dir, { recursive: true }, async (event, file) => {
    if (!file) return
    if (!ModuleLoaders.can_handle_extension(file)) return

    const prefix = `${dir}/`
    const path = file.slice(prefix.length)

    if (event === "remove") {
      library.cache.delete(path)
      app.logger.info(`(${event}) ${path}`)
    }

    if (event === "update") {
      library.cache.delete(path)
      const runner = app.createSpecialRunner({ path, library })
      const { error } = await runner.run(path)

      if (error) {
        app.logger.error(`(${event}) ${path}`)
      } else {
        app.logger.info(`(${event}) ${path}`)
      }
    }
  })
}
