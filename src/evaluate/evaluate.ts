import { Exp } from "../exp"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Trace } from "../trace"

export function evaluate(ctx: Ctx, env: Env, exp: Exp): Value {
  try {
    return exp.evaluate(ctx, env)
  } catch (error) {
    if (error instanceof Trace) throw error.trail(exp)
    throw error
  }
}
