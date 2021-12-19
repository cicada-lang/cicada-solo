import { Config } from "../config"
import { AppReplEventHandler } from "./app-repl-event-handler"

export class GenericApp {
  config = new Config()

  createReplEventHandler(): AppReplEventHandler {
    return new AppReplEventHandler({ config: this.config })
  }
}

export default new GenericApp()
