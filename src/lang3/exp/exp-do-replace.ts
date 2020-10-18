import * as Exp from "../exp"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Value from "../value"
import * as Pattern from "../pattern"
import * as Normal from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"

export function do_replace(
  target: Value.Value,
  motive: Value.Value,
  base: Value.Value
): Value.Value {
  if (target.kind === "Value.same") {
    return base
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.equal") {
      const base_t = Exp.do_ap(motive, target.t.from)
      const closure = Value.Closure.create(
        Mod.init(),
        Env.init(),
        Pattern.v("x"),
        Exp.type
      )
      const motive_t = Value.pi(target.t.t, closure)
      return Value.not_yet(
        Exp.do_ap(motive, target.t.to),
        Neutral.replace(
          target.neutral,
          new Normal.Normal(motive_t, motive),
          new Normal.Normal(base_t, base)
        )
      )
    } else {
      throw new Trace.Trace(
        Exp.explain_elim_target_type_mismatch({
          elim: "replace",
          expecting: ["Value.equal"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "replace",
        expecting: ["Value.same", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
