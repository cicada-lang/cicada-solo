import { GitLink } from "@enchanterjs/enchanter/lib/git-link"
import axios from "axios"
import contentDisposition from "content-disposition"

export type GitHubZipResult = {
  repo: string
  tag: string
  filename: string
  data: Buffer
}

export class GitHubZipDownloader {
  // NOTE Example targets:
  // - github.com/xieyuheng/mathematical-structures@0.0.1
  async download(target: string): Promise<GitHubZipResult> {
    const link = GitLink.decode(target)

    if (link.host !== "github.com") {
      throw new Error(`I expect host to be github.com`)
    }

    const zipUrl = this.formatZipUrl(link)

    const response = await axios.get(zipUrl, { responseType: "arraybuffer" })

    const { parameters } = contentDisposition.parse(
      response.headers["content-disposition"]
    )

    return {
      repo: link.repo,
      tag: link.tag,
      filename: parameters.filename,
      data: response.data,
    }
  }

  private formatZipUrl(opts: { repo: string; tag: string }): string {
    const { repo, tag } = opts
    return `https://github.com/${repo}/archive/refs/tags/${tag}.zip`
  }
}
