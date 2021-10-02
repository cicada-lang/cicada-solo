import chalk from "chalk"
import * as ut from "../ut"

export type LoggerOptions = {
  tag?: string
}

export class Logger {
  tag?: string

  constructor(opts?: LoggerOptions) {
    this.tag = opts?.tag
  }

  info(msg: string): void {
    const time = chalk.green(`[${ut.formatTime(new Date())}]`)
    if (this.tag) {
      const tag = chalk(`(${this.tag})`)
      console.log(tag, time, msg)
    } else {
      console.log(time, msg)
    }
  }

  error(msg: string): void {
    const time = chalk.red(`[${ut.formatTime(new Date())}]`)
    if (this.tag) {
      const tag = chalk(`(${this.tag})`)
      console.log(tag, time, msg)
    } else {
      console.log(time, msg)
    }
  }
}
