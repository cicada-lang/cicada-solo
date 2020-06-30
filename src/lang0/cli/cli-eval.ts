import * as Exp from "../exp"
import * as Trace from "../../trace"
import fs from "fs"

export function run(file: string, opts: any): void {
  const text = fs.readFileSync(file, { encoding: "utf-8" })
  const exp = Exp.parse(text)
  try {
    console.log(Exp.repr(Exp.normalize(exp)))
  } catch (error) {
    Trace.maybe_report(error, Exp.repr)
  }
}
