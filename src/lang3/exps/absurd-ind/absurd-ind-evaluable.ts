import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Explain from "../../explain"
import * as Value from "../../value"
import { Normal } from "../../normal"
import * as Neutral from "../../neutral"
import * as Trace from "../../../trace"
import { evaluate } from "../../evaluable"

export const absurd_ind_evaluable = (target: Exp, motive: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode }) =>
      do_absurd_ind(
        evaluate(target, { mod, env, mode }),
        evaluate(motive, { mod, env, mode })
      ),
  })

export function do_absurd_ind(
  target: Value.Value,
  motive: Value.Value
): Value.Value {
  if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.absurd") {
      return Value.not_yet(
        motive,
        Neutral.absurd_ind(target.neutral, Normal(Value.type, motive))
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "absurd_ind",
          expecting: ["Value.absurd"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "absurd_ind",
        expecting: ["Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
