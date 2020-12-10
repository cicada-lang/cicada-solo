import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Value from "../../value"

export function obj_evaluable(properties: Map<string, Exp>): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Value.obj(
        new Map(
          Array.from(properties, ([name, exp]) => [
            name,
            evaluator.evaluate(exp, { mod, env, mode }),
          ])
        )
      ),
  })
}
