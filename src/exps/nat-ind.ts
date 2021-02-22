import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import { evaluate } from "../evaluate"
import { check } from "../check"
import { nat_ind_step_t } from "../exp"
import * as Explain from "../explain"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../trace"
import { do_ap } from "./ap"
import { Type } from "./type"
import { Nat } from "./nat"
import { Pi } from "./pi"

export class NatInd implements Exp {
  kind = "NatInd"
  target: Exp
  motive: Exp
  base: Exp
  step: Exp

  constructor(target: Exp, motive: Exp, base: Exp, step: Exp) {
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  evaluability(env: Env): Value.Value {
    return do_nat_ind(
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base),
      evaluate(env, this.step)
    )
  }

  inferability(ctx: Ctx): Value.Value {
    // NOTE We should always infer target,
    //   but we do a simple check for the simple nat.
    check(ctx, this.target, Value.nat)
    const motive_t = evaluate(Env.init(), new Pi("x", new Nat(), new Type()))
    check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), this.motive)
    check(ctx, this.base, do_ap(motive_value, Value.zero))
    check(ctx, this.step, nat_ind_step_t(motive_value))
    const target_value = evaluate(ctx.to_env(), this.target)
    return do_ap(motive_value, target_value)
  }

  repr(): string {
    return `nat_ind(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return `nat_ind(${this.target.alpha_repr(opts)}, ${this.motive.alpha_repr(
      opts
    )}, ${this.base.alpha_repr(opts)}, ${this.step.alpha_repr(opts)})`
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
        Value.Closure.create(Env.init(), "k", new Type())
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
