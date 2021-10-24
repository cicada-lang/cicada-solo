import { Book } from "../book"
import { Config } from "../config"
import { AppReplEventHandler } from "./app-repl-event-handler"
import { customAlphabet } from "nanoid"
import * as CtxObservers from "../lang/ctx/ctx-observers"
import { CtxEvent, SimpleHighlighter, SimpleCtxObserver } from "../lang/ctx"
import * as ut from "../ut"

export class GenericApp {
  nanoid = customAlphabet("1234567890abcdef", 16)

  config = new Config()

  createCtxObserver = SimpleCtxObserver.create
  defaultCtxObservers = [new CtxObservers.ConsoleNarrator()]

  createHighlighter = SimpleHighlighter.create
  defaultHighlighter = this.createHighlighter({
    highlight: (tag, text) => {
      switch (tag) {
        case "code":
          return ut.colors.blue(text)
        default:
          return text
      }
    },
  })

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
      highlighter: this.defaultHighlighter,
    })
  }
}

export default new GenericApp()
