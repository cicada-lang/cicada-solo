import moment from "moment"
import chalk from "chalk"

export type LoggerOptions = {
  tag?: string
}

export class Logger {
  info(msg: string, opts?: LoggerOptions): void {
    const time = chalk.green.bold(`[${moment().format("HH:MM:SS")}]`)
    if (opts?.tag) {
      const tag = chalk.bold(`(${opts.tag})`)
      console.log(tag, time, msg)
    } else {
      console.log(time, msg)
    }
  }

  error(msg: string, opts?: LoggerOptions): void {
    const time = chalk.red.bold(`[${moment().format("HH:MM:SS")}]`)
    if (opts?.tag) {
      const tag = chalk.bold(`(${opts.tag})`)
      console.log(tag, time, msg)
    } else {
      console.log(time, msg)
    }
  }
}
