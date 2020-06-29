import * as Trace from "../trace"
import * as Exp from "../exp"

export function repr<T>(trace: Trace.Trace<T>, formater: (x: T) => string): string {
  let s = ""
  s += trace.message
  s += `previous:\n`
  for (const x of trace.previous) {
    s += `- ${formater(x)}\n`
  }
  return s
}
