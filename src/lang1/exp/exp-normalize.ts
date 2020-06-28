import * as Value from "../value"
import * as Exp from "../exp"
import * as Env from "../env"
import * as Ctx from "../ctx"

export function normalize(exp: Exp.Exp): Exp.Exp {
  const env = Env.init()
  const value = Exp.evaluate(env, exp)
  const ctx = Ctx.init()
  const t = Exp.infer(ctx, exp)
  return Value.readback(new Set(), t, value)
}
