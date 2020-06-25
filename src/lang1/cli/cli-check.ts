import * as Exp from "../exp"
import * as Ty from "../ty"
import * as Ctx from "../ctx"
import process from "process"
import fs from "fs"

export function run(file: string, opts: any): void {
  const ctx = Ctx.init()
  const text = fs.readFileSync(file, { encoding: "utf-8" })
  const exp = Exp.parse(text)
  try {
    const t = Exp.infer(ctx, exp)
    console.log(`${Exp.repr(exp)}: ${Ty.repr(t)}`)
  } catch (error) {
    if (error instanceof Exp.Trace.Trace) {
      const trace = error
      console.log(Exp.Trace.repr(trace))
      process.exit(1)
    } else {
      throw error
    }
  }
}
