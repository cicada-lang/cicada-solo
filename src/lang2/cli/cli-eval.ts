import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import fs from "fs"

export function run(file: string): void {
  const text = fs.readFileSync(file, { encoding: "utf-8" })
  const exp = Exp.parse(text)
  try {
    const ctx = Ctx.init()
    const t = Exp.infer(ctx, exp)
    const value = Exp.evaluate(Ctx.to_env(ctx), exp)
    const value_repr = Exp.repr(Value.readback(ctx, t, value))
    const _ = Value.readback(ctx, Value.type, t)
    const t_repr = Exp.repr(Value.readback(ctx, Value.type, t))
    console.log(`${value_repr}: ${t_repr}`)
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
