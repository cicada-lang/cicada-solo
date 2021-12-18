import { GitFileStore } from "@enchanterjs/enchanter/lib/git-file-store"
import { FakeGitFileStore } from "@enchanterjs/enchanter/lib/git-file-stores/fake-git-file-store"
import { GitLink } from "@enchanterjs/enchanter/lib/git-link"
import { Store } from "@enchanterjs/enchanter/lib/store"
import { BookConfigSchema } from "../book-config"

export class GitBookStore extends Store<GitFileStore> {
  async get(url: string): Promise<GitFileStore> {
    return this.getFromGitLink(GitLink.fromURL(url))
  }

  async getFromGitLink(link: GitLink): Promise<GitFileStore> {
    let files = link.createGitFileStore()
    const text = await files.getOrFail("book.json")
    const config = BookConfigSchema.validate(JSON.parse(text))
    files = files.cd(config.src)
    return files
  }

  fake(opts: {
    fallback: GitFileStore
    faked?: Record<string, string>
  }): GitFileStore {
    const { fallback, faked } = opts
    const files = new FakeGitFileStore({ faked, fallback })
    return files
  }
}
