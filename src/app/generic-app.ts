import { customAlphabet } from "nanoid"
import { Config } from "../config"
import { SimpleCtxObserver, SimpleHighlighter } from "../lang/ctx"
import * as ut from "../ut"
import { AppReplEventHandler } from "./app-repl-event-handler"

export class GenericApp {
  nanoid = customAlphabet("1234567890abcdef", 16)

  config = new Config()

  createCtxObserver = SimpleCtxObserver.create

  defaultCtxObservers = [
    this.createCtxObserver({
      receive: (event) => {
        if (event.tag === "todo") {
          console.log(event.msg)
          console.log()
        }
      },
    }),
  ]

  createHighlighter = SimpleHighlighter.create

  defaultHighlighter = this.createHighlighter({
    highlight: (tag, text) => {
      switch (tag) {
        case "code":
          return ut.colors.blue(text)
        case "warn":
          return ut.colors.red(text)
        case "note":
          return ut.colors.yellow(text)
        default:
          return text
      }
    },
  })

  createReplEventHandler(opts: { path: string }): AppReplEventHandler {
    const { path } = opts

    return new AppReplEventHandler({
      path,
      config: this.config,
      observers: this.defaultCtxObservers,
      highlighter: this.defaultHighlighter,
    })
  }
}

export default new GenericApp()
