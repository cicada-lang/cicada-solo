import * as Evaluate from "../evaluate"
import * as Env from "../env"
import * as Value from "../value"
import * as Neutral from "../neutral"
import { ApNeutral } from "../exps/ap-neutral"
import { FnValue } from "../exps/fn-value"
import { NotYetValue } from "../exps/not-yet-value"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (FnValue.is(target)) {
    const new_env = Env.update(Env.clone(target.env), target.name, arg)
    return Evaluate.evaluate(new_env, target.ret)
  }

  if (NotYetValue.is(target)) {
    return NotYetValue(ApNeutral(target.neutral, arg))
  }

  throw new Error("TODO")
}
