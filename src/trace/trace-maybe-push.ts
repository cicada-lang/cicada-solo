import * as Trace from "../trace"

export function maybe_push<T>(error: Error, x: T): never {
  if (error instanceof Trace.Trace) {
    const trace = error
    trace.previous.push(x)
    throw trace
  } else {
    throw error
  }
}
