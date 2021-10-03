import { AppConfig } from "./app-config"
import { AppReplEventHandler } from "./app-repl-event-handler"
import { Library } from "../library"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export class GenericApp {
  config = new AppConfig()

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

export default new GenericApp()
