import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Explain from "../../explain"
import * as Env from "../../env"
import * as Mod from "../../mod"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import { Normal } from "../../normal"
import * as Neutral from "../../neutral"
import * as Trace from "../../../trace"
import { Type } from "../type"
import { do_ap } from "../ap"

export const replace_evaluable = (target: Exp, motive: Exp, base: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      do_replace(
        evaluator.evaluate(target, { mod, env, mode }),
        evaluator.evaluate(motive, { mod, env, mode }),
        evaluator.evaluate(base, { mod, env, mode })
      ),
  })

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
      const closure = Value.Closure.create(
        Mod.init(),
        Env.init(),
        Pattern.v("x"),
        Type
      )
      const motive_t = Value.pi(target.t.t, closure)
      return Value.not_yet(
        do_ap(motive, target.t.to),
        Neutral.replace(
          target.neutral,
          Normal(motive_t, motive),
          Normal(base_t, base)
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
