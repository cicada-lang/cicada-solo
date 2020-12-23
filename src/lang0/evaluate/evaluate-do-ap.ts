import * as Evaluate from "../evaluate"
import * as Env from "../env"
import * as Value from "../value"
import * as Neutral from "../neutral"
import { ApNeutral } from "../exps/ap-neutral"
import { FnValue } from "../exps/fn-value"
import { NotYetValue } from "../exps/not-yet-value"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "FnValue") {
    const new_env = Env.update(
      Env.clone((target as FnValue).env),
      (target as FnValue).name,
      arg
    )
    return Evaluate.evaluate(new_env, (target as FnValue).ret)
  }

  if (target.kind === "NotYetValue") {
    return NotYetValue(ApNeutral((target as NotYetValue).neutral, arg))
  }

  throw new Error("TODO")
}
