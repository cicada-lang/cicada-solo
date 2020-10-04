import * as Exp from "../exp"
import * as Trace from "../../trace"
import * as pt from "../../partech"
import fs from "fs"

export function run(file: string): void {
  const text = fs.readFileSync(file, { encoding: "utf-8" })

  try {
    const exp = Exp.parse(text)
    console.log(Exp.repr(Exp.normalize(exp)))
  } catch (error) {
    if (error instanceof Trace.Trace) {
      const trace = error
      console.error(Trace.repr(trace, Exp.repr))
      process.exit(1)
    } if (error instanceof pt.ParsingError) {
      const message = error.message
      console.error(message)
      console.error(pt.Span.report(error.span, text))
      process.exit(1)
    } else {
      throw error
    }
  }
}
