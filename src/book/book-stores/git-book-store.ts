import { GitFileStore } from "@enchanterjs/enchanter/lib/git-file-store"
import { FakeGitFileStore } from "@enchanterjs/enchanter/lib/git-file-stores/fake-git-file-store"
import { GitLink } from "@enchanterjs/enchanter/lib/git-link"
import { Book } from "../book"
import { BookConfigSchema } from "../book-config"
import { BookStore } from "../book-store"

export class GitBookStore extends BookStore {
  async get(url: string): Promise<Book<GitFileStore>> {
    return this.getFromGitLink(GitLink.fromURL(url))
  }

  async getFromGitLink(link: GitLink): Promise<Book<GitFileStore>> {
    const files = link.createGitFileStore()
    const text = await files.getOrFail("book.json")
    const config = BookConfigSchema.validate(JSON.parse(text))
    return new Book({ config, files: files.cd(config.src) })
  }

  fake(opts: {
    fallback: GitFileStore
    faked?: Record<string, string>
  }): Book<FakeGitFileStore> {
    const { fallback, faked } = opts
    return new Book({
      config: Book.fakeConfig(),
      files: new FakeGitFileStore({ faked, fallback }),
    })
  }
}
