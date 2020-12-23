import * as Evaluate from "../evaluate"
import * as Env from "../env"
import * as Value from "../value"
import * as Neutral from "../neutral"
import { ApNeutral } from "../exps/ap-neutral"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "Value.fn") {
    const new_env = Env.update(
      Env.clone((target as Value.fn).env),
      (target as Value.fn).name,
      arg
    )
    return Evaluate.evaluate(new_env, (target as Value.fn).ret)
  }

  if (target.kind === "Value.not_yet") {
    return Value.not_yet(ApNeutral((target as Value.not_yet).neutral, arg))
  }

  throw new Error("TODO")
}
