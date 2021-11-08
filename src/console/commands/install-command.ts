import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import * as Commands from "../commands"
import app from "../../app/node-app"
import { BookConfig } from "../../book/book-config"
import ty from "@xieyuheng/ty"
import Path from "path"
import fs from "fs"
import { GitHubZipDownloader } from "../../infra/zip-downloaders/github-zip-downloader"

type Args = { target: string }
type Opts = { help?: boolean; version?: boolean }

export class InstallCommand extends Command<Args, Opts> {
  name = "install"

  description = "Install references for a book"

  args = { target: ty.string() }
  opts = {}

  async execute(argv: Args & Opts, runner: CommandRunner): Promise<void> {
    const configFile = process.cwd() + "/book.json"
    Command.assertFile(configFile)
    const book = await app.localBooks.get(configFile)

    // app.logger.info(book.config)

    const { target } = argv

    const t0 = Date.now()

    const zipDownloader = new GitHubZipDownloader()
    const { path, tag, filename, data } = await zipDownloader.download(target)

    const destination = `${app.home.dir}/references/github.com/${path}/${filename}`
    await fs.promises.mkdir(Path.dirname(destination), { recursive: true })
    await fs.promises.writeFile(destination, data)

    book.config.addReference(path, { tag })
    await fs.promises.writeFile(
      configFile,
      JSON.stringify(book.config.json(), null, 2)
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
