import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import fs from "fs"
import Path from "path"
import app from "../../app/node-app"
import { GitHubZipDownloader } from "../../infra/zip-downloaders/github-zip-downloader"

type Args = { target: string; name?: string }
type Opts = { help?: boolean; version?: boolean }

export class InstallCommand extends Command<Args, Opts> {
  name = "install"

  description = "Install references for a book"

  args = { target: ty.string(), name: ty.optional(ty.string()) }
  opts = {}

  async execute(argv: Args & Opts, runner: CommandRunner): Promise<void> {
    const configFile = process.cwd() + "/book.json"
    Command.assertFile(configFile)

    const book = await app.localBooks.get(configFile)

    const { target } = argv

    const t0 = Date.now()

    const zipDownloader = new GitHubZipDownloader()
    const { link, zip } = await zipDownloader.download(target)

    const destination = `${app.home.dir}/references/github.com/${link.repo}/${link.version}.zip`
    await fs.promises.mkdir(Path.dirname(destination), { recursive: true })
    await fs.promises.writeFile(
      destination,
      await zip.generateAsync({ type: "nodebuffer" })
    )

    book.config.references = {
      ...book.config.references,
      [argv.name || link.repo]: {
        host: link.host,
        repo: link.repo,
        version: link.version,
      },
    }

    await fs.promises.writeFile(
      configFile,
      JSON.stringify(book.config, null, 2)
    )

    const t1 = Date.now()

    app.logger.info({
      tag: "install",
      msg: "add new reference",
      target,
      destination,
      elapse: t1 - t0,
    })
  }
}
