import { Book } from "../book"
import { Config } from "../config"
import { AppReplEventHandler } from "./app-repl-event-handler"
import { customAlphabet } from "nanoid"
import * as CtxObservers from "../lang/ctx/ctx-observers"

export class GenericApp {
  nanoid = customAlphabet("1234567890abcdef", 16)

  config = new Config()

  defaultCtxObservers = [new CtxObservers.NarrationLogger()]

  createReplEventHandler(opts: {
    book: Book
    path: string
  }): AppReplEventHandler {
    const { book, path } = opts

    return new AppReplEventHandler({
      book,
      path,
      config: this.config,
      observers: this.defaultCtxObservers,
    })
  }
}

export default new GenericApp()
