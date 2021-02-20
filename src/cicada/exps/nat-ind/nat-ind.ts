import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { nat_ind_step_t } from "../../exp"
import * as Explain from "../../explain"
import * as Env from "../../env"
import * as Ctx from "../../ctx"
import * as Value from "../../value"
import * as Normal from "../../normal"
import * as Neutral from "../../neutral"
import * as Trace from "../../../trace"
import { do_ap } from "../ap"
import { Type } from "../type"
import { Nat } from "../nat"
import { Pi } from "../pi"

export type NatInd = Exp & {
  kind: "NatInd"
  target: Exp
  motive: Exp
  base: Exp
  step: Exp
}

export function NatInd(target: Exp, motive: Exp, base: Exp, step: Exp): NatInd {
  return {
    kind: "NatInd",
    target,
    motive,
    base,
    step,
    evaluability: ({ env }) =>
      do_nat_ind(
        evaluate(env, target),
        evaluate(env, motive),
        evaluate(env, base),
        evaluate(env, step)
      ),
    ...Inferable({
      inferability: ({ ctx }) => {
        // NOTE We should always infer target,
        //   but we do a simple check for the simple nat.
        check(ctx, target, Value.nat)
        const motive_t = evaluate(Env.init(), Pi("x", Nat, Type))
        check(ctx, motive, motive_t)
        const motive_value = evaluate(Ctx.to_env(ctx), motive)
        check(ctx, base, do_ap(motive_value, Value.zero))
        check(ctx, step, nat_ind_step_t(motive_value))
        const target_value = evaluate(Ctx.to_env(ctx), target)
        return do_ap(motive_value, target_value)
      },
    }),
    repr: () =>
      `Nat.ind(${target.repr()}, ${motive.repr()}, ${base.repr()}, ${step.repr()})`,
    alpha_repr: (opts) =>
      `Nat.ind(${target.alpha_repr(opts)}, ${motive.alpha_repr(
        opts
      )}, ${base.alpha_repr(opts)}, ${step.alpha_repr(opts)})`,
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
