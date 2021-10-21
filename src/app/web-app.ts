import { GenericApp } from "./generic-app"
import { GitBookStore } from "../book/book-stores/git-book-store"

export class WebApp extends GenericApp {
  gitBooks = new GitBookStore()
}

export default new WebApp()
