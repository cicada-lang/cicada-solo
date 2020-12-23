import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import * as Value from "../../value"
import * as Evaluate from "../../evaluate"
import * as Env from "../../env"
import { ApNeutral } from "../ap-neutral"
import { FnValue } from "../fn-value"
import { NotYetValue } from "../not-yet-value"

export type Ap = Exp & {
  kind: "Ap"
  target: Exp
  arg: Exp
}

export function Ap(target: Exp, arg: Exp): Ap {
  return {
    kind: "Ap",
    target,
    arg,
    ...Evaluable({
      evaluability: ({ env }) =>
        do_ap(evaluate(env, target), evaluate(env, arg)),
    }),
    repr: () => `${target.repr()}(${arg.repr()})`,
  }
}

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (FnValue.is(target)) {
    const new_env = Env.update(Env.clone(target.env), target.name, arg)
    return Evaluate.evaluate(new_env, target.ret)
  }

  if (NotYetValue.is(target)) {
    return NotYetValue(ApNeutral(target.neutral, arg))
  }

  throw new Error(`Target is not Appliable: ${target.kind}`)
}
