import { Book } from "../book"
import { Config } from "../config"
import { AppReplEventHandler } from "./app-repl-event-handler"
import { customAlphabet } from "nanoid"
import * as CtxObservers from "../lang/ctx/ctx-observers"
import { CtxEvent, SimpleCtxObserver } from "../lang/ctx"

export class GenericApp {
  nanoid = customAlphabet("1234567890abcdef", 16)

  config = new Config()

  defaultCtxObservers = [new CtxObservers.NarrationLogger()]

  createCtxObserver(opts: {
    receive: (event: CtxEvent) => void
  }): SimpleCtxObserver {
    return new SimpleCtxObserver(opts)
  }

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
