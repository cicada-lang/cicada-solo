import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import * as Commands from "../commands"
import app from "../../app/node-app"
import ty from "@xieyuheng/ty"
import axios from "axios"
import Path from "path"
import fs from "fs"
import JSZip from "jszip"
import contentDisposition from "content-disposition"

type Args = { target: string }
type Opts = { help?: boolean; version?: boolean }

export class InstallCommand extends Command<Args, Opts> {
  name = "install"

  description = "Install references for a book"

  args = { target: ty.string() }
  opts = {}

  async execute(argv: Args & Opts, runner: CommandRunner): Promise<void> {
    const { target } = argv

    const [path, tag] = target.split("@")
    const zipUrl = `https://github.com/${path}/archive/refs/tags/${tag}.zip`

    const response = await axios.get(zipUrl, {
      responseType: "arraybuffer",
    })

    const {
      parameters: { filename },
    } = contentDisposition.parse(response.headers["content-disposition"])

    const outputFile = `${app.home.dir}/references/github.com/${path}/${filename}`
    await fs.promises.mkdir(Path.dirname(outputFile), { recursive: true })
    await fs.promises.writeFile(outputFile, response.data)

    app.logger.info({
      tag: "install",
      target,
      zipUrl,
      saveTo: outputFile,
    })

    {
      // const zip = new JSZip()
      // await zip.loadAsync(response.data)
      // const result = await zip
      //   .file(`${Path.parse(filename).name}/book.json`)
      //   ?.async("string")
      // console.log(result)
    }
  }
}
