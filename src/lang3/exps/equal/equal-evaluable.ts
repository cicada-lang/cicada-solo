import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluable"
import { Exp } from "../../exp"
import * as Value from "../../value"

export const equal_evaluable = (t: Exp, from: Exp, to: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode }) =>
      Value.equal(
        evaluate(t, { mod, env, mode }),
        evaluate(from, { mod, env, mode }),
        evaluate(to, { mod, env, mode })
      ),
  })
