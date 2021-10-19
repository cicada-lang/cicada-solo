import { GenericApp } from "./generic-app"
import { GitBookStore } from "../book-stores/git-book-store"
export class WebApp extends GenericApp {
  createGitBookStore(): GitBookStore {
    return new GitBookStore()
  }
}

export default new WebApp()
