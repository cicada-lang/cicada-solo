import * as Explain from "../explain"
import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"
import { do_ap } from "../exps/ap"

export function do_replace(
  target: Value.Value,
  motive: Value.Value,
  base: Value.Value
): Value.Value {
  if (target.kind === "Value.same") {
    return base
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.equal") {
      const base_t = do_ap(motive, target.t.from)
      const closure = Value.Closure.create(Env.init(), "x", Exp.type)
      const motive_t = Value.pi(target.t.t, closure)
      return Value.not_yet(
        do_ap(motive, target.t.to),
        Neutral.replace(
          target.neutral,
          Normal.create(motive_t, motive),
          Normal.create(base_t, base)
        )
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "replace",
          expecting: ["Value.equal"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "replace",
        expecting: ["Value.same", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
