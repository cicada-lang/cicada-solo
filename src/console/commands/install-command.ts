import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import * as Commands from "../commands"
import app from "../../app/node-app"
import ty from "@xieyuheng/ty"
import axios from "axios"
import Path from "path"
import fs from "fs"
import contentDisposition from "content-disposition"
import { GitHubZipDownloader } from "../../infra/zip-downloaders/github-zip-downloader"

type Args = { target: string }
type Opts = { help?: boolean; version?: boolean }

export class InstallCommand extends Command<Args, Opts> {
  name = "install"

  description = "Install references for a book"

  args = { target: ty.string() }
  opts = {}

  async execute(argv: Args & Opts, runner: CommandRunner): Promise<void> {
    const { target } = argv

    const t0 = Date.now()

    const zipDownloader = new GitHubZipDownloader()
    const { path, filename, data } = await zipDownloader.download(target)

    const destination = `${app.home.dir}/references/github.com/${path}/${filename}`
    await fs.promises.mkdir(Path.dirname(destination), { recursive: true })
    await fs.promises.writeFile(destination, data)

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
