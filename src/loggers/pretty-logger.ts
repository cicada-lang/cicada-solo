import { Logger } from "../logger"
import * as ut from "../ut"

export class PrettyLogger extends Logger {
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
    const lv = ut.colors.bold(level.toUpperCase())

    if (level === "info") {
      return ut.colors.blue(lv)
    } else if (level === "error") {
      return ut.colors.red(lv)
    } else {
      return lv
    }
  }

  private formatTime(t: Date): string {
    const time = ut.formatTime(new Date(), { withMilliseconds: true })
    return ut.colors.yellow(`[${time}]`)
  }

  private formatTag(tag: string): string {
    return ut.colors.bold(`(${tag})`)
  }

  private formatProperty(key: string, value: any): string {
    const k = ut.colors.italic(ut.colors.yellow(key))
    const v = JSON.stringify(value)
    return `  ${k}: ${v}`
  }

  log(opts: { level: string; tag?: string; msg?: string }): void {
    const { level, tag, msg } = opts

    let s = ""

    s += this.formatTime(new Date()) + " "
    s += this.formatLevel(level) + " "
    if (tag) s += this.formatTag(tag) + " "
    if (msg) s += `${msg}`
    s += "\n"

    for (const [key, value] of Object.entries(opts)) {
      if (!["level", "tag", "msg"].includes(key)) {
        s += this.formatProperty(key, value)
        s += "\n"
      }
    }

    console.log(s.trim())
  }
}
