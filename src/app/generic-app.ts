import { AppConfig } from "./app-config"
import { AppReplEventHandler } from "./app-repl-event-handler"
import { Library } from "../library"
import { customAlphabet } from "nanoid"
import pino from "pino"

export class GenericApp {
  nanoid = customAlphabet("1234567890abcdef", 16)

  config = new AppConfig()

  logger = pino(
    pino.transport({
      target: "pino-pretty",
      options: {
        translateTime: "SYS:HH:MM:ss.l",
        ignore: "pid,hostname",
      },
    })
  )

  createReplEventHandler(opts: {
    library: Library
    path: string
  }): AppReplEventHandler {
    return new AppReplEventHandler(opts)
  }
}

export default new GenericApp()
