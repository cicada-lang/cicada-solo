import * as Trace from "./trace"
import * as Exp from "../exp"

export function repr(trace: Trace.Trace): string {
  let s = ""
  s += trace.message
  s += `trace:\n`
  for (const exp of trace.previous) {
    s += `- ${Exp.repr(exp)}\n`
  }
  return s
}
