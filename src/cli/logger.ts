import moment from "moment"
import chalk from "chalk"

export type LoggerOptions = {
  tag?: string
}

export class Logger {
  tag?: string

  constructor(opts?: LoggerOptions) {
    this.tag = opts?.tag
  }

  info(msg: string): void {
    const time = chalk.green.bold(`[${moment().format("HH:MM:SS")}]`)
    if (this.tag) {
      const tag = chalk.bold(`(${this.tag})`)
      console.log(tag, time, msg)
    } else {
      console.log(time, msg)
    }
  }

  error(msg: string): void {
    const time = chalk.red.bold(`[${moment().format("HH:MM:SS")}]`)
    if (this.tag) {
      const tag = chalk.bold(`(${this.tag})`)
      console.log(tag, time, msg)
    } else {
      console.log(time, msg)
    }
  }
}
