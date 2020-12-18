import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluable"
import { Exp } from "../../exp"
import * as Value from "../../value"

export const union_evaluable = (left: Exp, right: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode }) =>
      Value.union(
        evaluate(left, { mod, env, mode }),
        evaluate(right, { mod, env, mode })
      ),
  })
