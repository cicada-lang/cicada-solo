import { GitBookStore } from "../book/book-stores/git-book-store"
import { GenericApp } from "./generic-app"

export class WebApp extends GenericApp {
  gitBooks = new GitBookStore()
}

export default new WebApp()
