import { GitFileStore } from "@enchanterjs/enchanter/lib/git-file-store"
import { FakeGitFileStore } from "@enchanterjs/enchanter/lib/git-file-stores/fake-git-file-store"
import { GitLink } from "@enchanterjs/enchanter/lib/git-link"
import { Store } from "@enchanterjs/enchanter/lib/store"
import { Book } from "../book"
import { BookConfigSchema } from "../book-config"

export class GitBookStore extends Store<[Book<GitFileStore>, GitFileStore]> {
  async get(url: string): Promise<[Book<GitFileStore>, GitFileStore]> {
    return this.getFromGitLink(GitLink.fromURL(url))
  }

  async getFromGitLink(
    link: GitLink
  ): Promise<[Book<GitFileStore>, GitFileStore]> {
    let files = link.createGitFileStore()
    const text = await files.getOrFail("book.json")
    const config = BookConfigSchema.validate(JSON.parse(text))
    files = files.cd(config.src)
    const book = new Book({ config, files })
    return [book, files]
  }

  fake(opts: {
    fallback: GitFileStore
    faked?: Record<string, string>
  }): [Book<GitFileStore>, GitFileStore] {
    const { fallback, faked } = opts
    const files = new FakeGitFileStore({ faked, fallback })
    const book = new Book({ config: Book.fakeConfig(), files })
    return [book, files]
  }
}
