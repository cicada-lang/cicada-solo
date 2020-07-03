import * as Exp from "../exp"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Trace from "../../trace"

export function do_absurd_ind(
  target: Value.Value,
  motive: Value.Value
): Value.Value {
  if (target.kind === "Value.Reflection") {
    if (target.t.kind === "Value.Absurd") {
      return {
        kind: "Value.Reflection",
        t: motive,
        neutral: {
          kind: "Neutral.AbsurdInd",
          target: target.neutral,
          motive: new Normal.Normal({ kind: "Value.Type" }, motive),
        },
      }
    } else {
      throw new Trace.Trace(
        Exp.explain_elim_target_type_mismatch({
          elim: "absurd_ind",
          expecting: ["Value.Absurd"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "absurd_ind",
        expecting: ["Value.Reflection"],
        reality: target.kind,
      })
    )
  }
}
