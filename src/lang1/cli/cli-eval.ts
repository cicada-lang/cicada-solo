import * as Exp from "../exp"
import * as Ty from "../ty"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Trace from "../../trace"
import * as ut from "../../ut"
import fs from "fs"

export function run(file: string): void {
  const text = fs.readFileSync(file, { encoding: "utf-8" })
  const exp = Exp.parse(text)
  try {
    const ctx = Ctx.init()
    const t = Exp.infer(ctx, exp)
    const env = Env.init()
    console.log(`${Exp.repr(Exp.normalize(exp))}: ${Ty.repr(t)}`)
  } catch (error) {
    if (error instanceof Trace.Trace) {
      const trace = error
      console.error(Trace.repr(trace, Exp.repr))
      process.exit(1)
    } else {
      throw error
    }
  }
}
