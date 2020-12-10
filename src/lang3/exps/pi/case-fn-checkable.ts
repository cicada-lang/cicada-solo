import { Fn } from "./fn"
import { Checkable } from "../../checkable"
import * as Check from "../../check"
import * as Value from "../../value"
import { Case } from "./case-fn"

export function case_fn_checkable(cases: Array<Case>): Checkable {
  return Checkable({
    checkability: (t, { mod, ctx }) => {
      const pi = Value.is_pi(mod, ctx, t)
      for (const { pattern, ret } of cases) {
        Check.check(mod, ctx, Fn(pattern, ret), pi)
      }
    },
  })
}
