import { Library } from "../library"
import { AppReplEventHandler } from "./app-repl-event-handler"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export class App {
  createReplEventHandler(opts: {
    library: Library
    path: string
  }): AppReplEventHandler {
    return new AppReplEventHandler(opts)
  }

  nanoid(): string {
    return nanoid()
  }
}
