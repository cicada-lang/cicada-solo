import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"

export function elim_ap(rator: Value.Value, rand: Value.Value): Value.Value {
  const new_env = Env.clone(rator.env)
  Env.extend(Env.clone(rator.env), rator.name, rand)
  return Exp.evaluate(new_env, rator.body)
}
