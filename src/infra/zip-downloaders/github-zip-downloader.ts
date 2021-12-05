import axios from "axios"
import contentDisposition from "content-disposition"
import { ZipDownloader, ZipResult } from "../zip-downloader"

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
