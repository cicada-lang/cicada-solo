import * as Env from "../env"
import * as Mod from "../mod"
import * as Exp from "../exp"
import * as Value from "../value"

export interface Closure {
  name: string
  exp: Exp.Exp
  mod: Mod.Mod
  env: Env.Env
}

export function apply(
  cl: Closure,
  args: Array<Value.Value>
): Array<Value.Value> {
  const { name, exp, mod, env } = cl
  return Exp.evaluate(mod, Env.extend(env, name, args), exp)
}
