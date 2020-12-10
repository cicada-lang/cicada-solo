import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Value from "../../value"

export function typecons_evaluable(
  name: string,
  t: Exp,
  sums: Array<{ tag: string; t: Exp }>
): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Value.typecons(
        name,
        evaluator.evaluate(t, { mod, env, mode }),
        Value.DelayedSums.create(sums, mod, env)
      ),
  })
}
