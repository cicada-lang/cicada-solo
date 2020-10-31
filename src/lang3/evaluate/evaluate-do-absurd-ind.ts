import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"

export function do_absurd_ind(
  target: Value.Value,
  motive: Value.Value
): Value.Value {
  if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.absurd") {
      return Value.not_yet(
        motive,
        Neutral.absurd_ind(target.neutral, Normal.create(Value.type, motive))
      )
    } else {
      throw new Trace.Trace(
        Evaluate.explain_elim_target_type_mismatch({
          elim: "absurd_ind",
          expecting: ["Value.absurd"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Evaluate.explain_elim_target_mismatch({
        elim: "absurd_ind",
        expecting: ["Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
