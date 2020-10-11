import * as Trace from "../trace"

export function trail<T>(trace: Trace.Trace<T>, x: T): Trace.Trace<T> {
  trace.previous.push(x)
  return trace
}
