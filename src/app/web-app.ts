import { GenericApp } from "./generic-app"
import { GitBookStore } from "../book-stores/git-book-store"
import { CtxObserver } from "../ctx"

export class WebApp extends GenericApp {
  createGitBookStore(opts: { observers: Array<CtxObserver> }): GitBookStore {
    return new GitBookStore(opts)
  }
}

export default new WebApp()
