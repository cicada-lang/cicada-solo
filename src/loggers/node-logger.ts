import { Logger } from "../logger"
import * as ut from "../ut"

export class NodeLogger extends Logger {
  info(input: string | Object): void {
    if (typeof input === "string") {
      this.log({ msg: input, level: "info" })
    } else {
      this.log({ ...input, level: "info" })
    }
  }

  error(input: string | Object): void {
    if (typeof input === "string") {
      this.log({ msg: input, level: "error" })
    } else {
      this.log({ ...input, level: "error" })
    }
  }

  log(opts: { msg?: string; level: string; tag?: string }): void {
    const time = ut.formatTime(new Date(), { withMilliseconds: true })
    console.log({ ...opts, time })
  }
}
