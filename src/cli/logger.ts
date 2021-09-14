import moment from "moment"
import chalk from "chalk"

export class Logger {
  info(tag: string, path: string): void {
    console.log(
      chalk.bold(`(${tag})`),
      chalk.green.bold(`[${moment().format("HH:MM:SS")}]`),
      path
    )
  }

  error(tag: string, path: string): void {
    console.log(
      chalk.bold(`(${tag})`),
      chalk.red.bold(`[${moment().format("HH:MM:SS")}]`),
      path
    )
  }
}
