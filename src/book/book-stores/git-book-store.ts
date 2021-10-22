import { BookStore } from "../book-store"
import { Book } from "../book"
import { GitFileStore } from "@enchanterjs/enchanter/lib/git-file-store"
import { FakeGitFileStore } from "@enchanterjs/enchanter/lib/git-file-stores/fake-git-file-store"
import { GitPath } from "@enchanterjs/enchanter/lib/git-path"
import * as ut from "../../ut"

export class GitBookStore extends BookStore {
  async get(url: string): Promise<Book<GitFileStore>> {
    return this.getFromGitPath(GitPath.fromURL(url))
  }

  async getFromGitPath(gitPath: GitPath): Promise<Book<GitFileStore>> {
    const files = gitPath.createGitFileStore()
    const text = await files.getOrFail("book.json")
    const config = Book.bookConfigSchema.validate(JSON.parse(text))
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
