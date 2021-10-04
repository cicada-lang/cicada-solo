import { Library } from "../library"
import { Runner } from "../runner"
import { SnapshotRunner, ErrorRunner } from "../runners"
import { AppConfig } from "./app-config"
import { AppReplEventHandler } from "./app-repl-event-handler"
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

  createSpecialRunner(opts: { path: string; library: Library }): Runner {
    const { path } = opts

    if (ErrorRunner.extensions.some((e) => path.endsWith(e))) {
      return new ErrorRunner(opts)
    } else if (SnapshotRunner.extensions.some((e) => path.endsWith(e))) {
      return new SnapshotRunner(opts)
    } else {
      throw new Error(`I can not handle file extension: ${path}`)
    }
  }
}

export default new GenericApp()
