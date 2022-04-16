import { colors } from "../../ut/colors"
import { formatTime } from "../../ut/format-date"
import { indent } from "../../ut/indent"
import { Logger, LogOptions } from "../logger"

export class PrettyLogger extends Logger {
  log(opts: LogOptions): void {
    const { level, elapse, tag, msg } = opts

    let s = ""

    s += this.formatTime(new Date()) + " "
    s += this.formatLevel(level) + " "

    if (tag) s += this.formatTag(tag) + " "
    if (msg) s += `${msg}`
    if (elapse !== undefined) s += " " + this.formatElapse(elapse)

    s += "\n"

    for (const [key, value] of Object.entries(opts)) {
      if (!["level", "tag", "msg", "elapse"].includes(key)) {
        if (value !== undefined) {
          s += this.formatProperty(key, value)
          s += "\n"
        }
      }
    }

    console.log(s.trim())
  }

  private formatLevel(level: string): string {
    const lv = colors.bold(level.toUpperCase())

    if (level === "info") {
      return colors.blue(lv)
    } else if (level === "error") {
      return colors.red(lv)
    } else {
      return lv
    }
  }

  private formatTime(t: Date): string {
    const time = formatTime(new Date(), { withMilliseconds: true })
    return colors.yellow(`[${time}]`)
  }

  private formatElapse(elapse: number): string {
    return colors.yellow(`<${elapse}ms>`)
  }

  private formatTag(tag: string): string {
    return colors.bold(`(${tag})`)
  }

  private formatProperty(key: string, value: any): string {
    const k = colors.italic(colors.yellow(key))
    const j = JSON.stringify(value, null, 2)
    const v = indent(j, "  ").trim()
    return `  ${k}: ${v}`
  }
}
