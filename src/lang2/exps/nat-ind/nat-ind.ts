import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Type } from "../type"
import { nat_ind_step_t } from "../../exp"
import * as Explain from "../../explain"
import * as Env from "../../env"
import * as Value from "../../value"
import * as Normal from "../../normal"
import * as Neutral from "../../neutral"
import * as Trace from "../../../trace"
import { do_ap } from "../ap"
import { Repr } from "../../repr"
import { repr } from "../../exp"

export type NatInd = Evaluable &
  Repr & {
    kind: "Exp.nat_ind"
    target: Exp
    motive: Exp
    base: Exp
    step: Exp
  }

export function NatInd(target: Exp, motive: Exp, base: Exp, step: Exp): NatInd {
  return {
    kind: "Exp.nat_ind",
    target,
    motive,
    base,
    step,
    repr: () =>
      `Nat.ind(${repr(target)}, ${repr(motive)}, ${repr(base)}, ${repr(step)})`,
    evaluability: ({ env }) =>
      do_nat_ind(
        evaluate(env, target),
        evaluate(env, motive),
        evaluate(env, base),
        evaluate(env, step)
      ),
  }
}

export function do_nat_ind(
  target: Value.Value,
  motive: Value.Value,
  base: Value.Value,
  step: Value.Value
): Value.Value {
  if (target.kind === "Value.zero") {
    return base
  } else if (target.kind === "Value.add1") {
    return do_ap(
      do_ap(step, target.prev),
      do_nat_ind(target.prev, motive, base, step)
    )
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.nat") {
      const motive_t = Value.pi(
        Value.nat,
        Value.Closure.create(Env.init(), "k", Type)
      )
      const base_t = do_ap(motive, Value.zero)
      const step_t = nat_ind_step_t(motive)
      return Value.not_yet(
        do_ap(motive, target),
        Neutral.nat_ind(
          target.neutral,
          Normal.create(motive_t, motive),
          Normal.create(base_t, base),
          Normal.create(step_t, step)
        )
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "nat_ind",
          expecting: ["Value.nat"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "nat_ind",
        expecting: ["Value.zero", "Value.add1", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
