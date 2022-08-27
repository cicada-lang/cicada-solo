export type LogOptions =
  | {
      level: string
      elapse?: number
      tag?: string
      msg?: string
    }
  | Record<string, any>

export abstract class Logger {
  abstract log(opts: LogOptions): void

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
}
