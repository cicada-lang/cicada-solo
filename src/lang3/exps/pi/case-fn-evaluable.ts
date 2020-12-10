import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Case } from "./case-fn"

export function case_fn_evaluable(cases: Array<Case>): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode }) =>
      Value.case_fn(
        cases.map(({ pattern, ret }) =>
          Value.Closure.create(mod, env, pattern, ret)
        )
      ),
  })
}
