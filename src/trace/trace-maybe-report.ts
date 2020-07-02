import * as Trace from "../trace"
import process from "process"

export function maybe_report<T>(
  error: Error,
  formater: (x: T) => string
): never {
  if (error instanceof Trace.Trace) {
    const trace = error
    console.error(Trace.repr(trace, formater))
    process.exit(1)
  } else {
    throw error
  }
}
