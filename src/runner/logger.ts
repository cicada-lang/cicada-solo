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

  info(opts: { msg: string; tag?: string }): void {
    const { msg, tag } = opts

    const time = chalk.green(`[${ut.formatTime(new Date())}]`)

    if (tag || this.tag) {
      console.log(chalk(`(${tag || this.tag})`), time, msg)
    } else {
      console.log(time, msg)
    }
  }

  error(opts: { msg: string; tag?: string }): void {
    const { msg, tag } = opts

    const time = chalk.red(`[${ut.formatTime(new Date())}]`)

    if (tag || this.tag) {
      console.log(chalk(`(${tag || this.tag})`), time, msg)
    } else {
      console.log(time, msg)
    }
  }
}
