import { ZipDownloader, ZipResult } from "../zip-downloader"
import contentDisposition from "content-disposition"
import axios from "axios"
import Path from "path"
import fs from "fs"

export class GitHubZipDownloader extends ZipDownloader {
  private parseTarget(target: string): { path: string; tag: string } {
    const [path, tag] = target.split("@")
    return { path, tag }
  }

  private formatZipUrl(opts: { path: string; tag: string }): string {
    const { path, tag } = opts
    return `https://github.com/${path}/archive/refs/tags/${tag}.zip`
  }

  async download(target: string): Promise<ZipResult> {
    const { path, tag } = this.parseTarget(target)
    const zipUrl = this.formatZipUrl({ path, tag })

    const response = await axios.get(zipUrl, { responseType: "arraybuffer" })
    const { parameters } = contentDisposition.parse(
      response.headers["content-disposition"]
    )

    return {
      path,
      tag,
      filename: parameters.filename,
      data: response.data,
    }
  }
}
