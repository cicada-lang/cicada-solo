import chalk from "chalk"
import * as ut from "../ut"

export class Logger {
  info(opts: { msg: string; tag?: string }): void {
    const { msg, tag } = opts

    const time = chalk.blue(`[${ut.formatTime(new Date())}]`)

    if (tag) {
      console.log(chalk(`(${tag})`), time, msg)
    } else {
      console.log(time, msg)
    }
  }

  error(opts: { msg: string; tag?: string }): void {
    const { msg, tag } = opts

    const time = chalk.red(`[${ut.formatTime(new Date())}]`)

    if (tag) {
      console.log(chalk(`(${tag})`), time, msg)
    } else {
      console.log(time, msg)
    }
  }
}
