import { ZipDownloader } from "../zip-downloader"
import contentDisposition from "content-disposition"
import axios from "axios"
import Path from "path"
import fs from "fs"

export class GitHubZipDownloader extends ZipDownloader {
  async download(target: string): Promise<{
    path: string
    tag: string
    filename: string
    data: Buffer
  }> {
    const [path, tag] = target.split("@")

    const zipUrl = `https://github.com/${path}/archive/refs/tags/${tag}.zip`

    const response = await axios.get(zipUrl, {
      responseType: "arraybuffer",
    })

    const {
      parameters: { filename },
    } = contentDisposition.parse(response.headers["content-disposition"])

    return { path, tag, filename, data: response.data }
  }
}
