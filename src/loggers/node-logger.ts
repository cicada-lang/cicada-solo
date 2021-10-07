import { Logger } from "../logger"
import * as ut from "../ut"

export class NodeLogger extends Logger {
  info(input: string | Record<string, any>): void {
    if (typeof input === "string") {
      this.log({ msg: input, level: "info" })
    } else {
      this.log({ ...input, level: "info" })
    }
  }

  error(input: string | Record<string, any>): void {
    if (typeof input === "string") {
      this.log({ msg: input, level: "error" })
    } else {
      this.log({ ...input, level: "error" })
    }
  }

  private formatLevel(level: string): string {
    if (level === "info") {
      return ut.colors.blue(level.toUpperCase())
    } else if (level === "error") {
      return ut.colors.red(level.toUpperCase())
    } else {
      return level.toUpperCase()
    }
  }

  private formatTime(t: Date): string {
    const time = ut.formatTime(new Date(), { withMilliseconds: true })
    return ut.colors.yellow(`[${time}]`)
  }

  log(opts: { level: string; tag?: string; msg?: string }): void {
    const { level, tag, msg } = opts

    let s = ""

    s += `${this.formatTime(new Date())} `
    s += `${this.formatLevel(level)} `
    if (tag) s += `(${tag}) `
    if (msg) s += `${msg}`
    s += "\n"

    for (const [key, value] of Object.entries(opts)) {
      if (!["level", "tag", "msg"].includes(key)) {
        s += `  ${key}: ${JSON.stringify(value)}`
        s += "\n"
      }
    }

    console.log(s.trim())
  }
}
