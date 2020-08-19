import * as Exp from "../exp"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Trace from "../../trace"

export function do_absurd_ind(
  target: Value.Value,
  motive: Value.Value
): Value.Value {
  if (target.kind === "Value.reflection") {
    if (target.t.kind === "Value.absurd") {
      return {
        kind: "Value.reflection",
        t: motive,
        neutral: {
          kind: "Neutral.absurd_ind",
          target: target.neutral,
          motive: new Normal.Normal({ kind: "Value.type" }, motive),
        },
      }
    } else {
      throw new Trace.Trace(
        Exp.explain_elim_target_type_mismatch({
          elim: "absurd_ind",
          expecting: ["Value.absurd"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "absurd_ind",
        expecting: ["Value.reflection"],
        reality: target.kind,
      })
    )
  }
}
