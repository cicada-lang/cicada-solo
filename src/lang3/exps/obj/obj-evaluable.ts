import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluable"
import { Exp } from "../../exp"
import * as Value from "../../value"

export const obj_evaluable = (properties: Map<string, Exp>) =>
  Evaluable({
    evaluability: ({ mod, env, mode }) =>
      Value.obj(
        new Map(
          Array.from(properties, ([name, exp]) => [
            name,
            evaluate(exp, { mod, env, mode }),
          ])
        )
      ),
  })
