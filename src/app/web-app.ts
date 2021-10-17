import { GenericApp } from "./generic-app"
import { GitBookStore } from "../book-stores/git-book-store"
import { CtxOptions } from "../ctx"

export class WebApp extends GenericApp {
  createGitBookStore(opts: { ctx: CtxOptions }): GitBookStore {
    return new GitBookStore(opts)
  }
}

export default new WebApp()
