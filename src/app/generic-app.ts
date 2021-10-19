import { Book } from "../book"
import { AppConfig } from "./app-config"
import { AppReplEventHandler } from "./app-repl-event-handler"
import { customAlphabet } from "nanoid"
import * as CtxObservers from "../ctx/ctx-observers"

export class GenericApp {
  nanoid = customAlphabet("1234567890abcdef", 16)

  config = new AppConfig()

  defaultCtxOptions = {
    observers: [new CtxObservers.NarrationLogger()],
  }

  createReplEventHandler(opts: {
    book: Book
    path: string
  }): AppReplEventHandler {
    return new AppReplEventHandler(opts)
  }
}

export default new GenericApp()
