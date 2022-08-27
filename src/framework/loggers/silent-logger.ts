import { Logger, LogOptions } from "../logger"

export class SilentLogger extends Logger {
  log(opts: LogOptions): void {}
}
