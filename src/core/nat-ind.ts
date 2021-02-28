import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { evaluate } from "../evaluate"
import { check } from "../check"
import * as Explain from "../explain"
import { Value } from "../value"
import * as Closure from "../closure"
import { Normal } from "../normal"
import { Trace } from "../trace"
import { Type } from "./type"
import { Nat } from "./nat"
import { Pi, Ap } from "../core"
import { NatValue, ZeroValue, Add1Value, NatIndNeutral } from "../core"
import { PiValue } from "../core"
import { NotYetValue } from "../core"
import { nat_ind_step_t } from "./nat-util"

export class NatInd implements Exp {
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

  evaluate(env: Env): Value {
    return NatInd.apply(
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base),
      evaluate(env, this.step)
    )
  }

  infer(ctx: Ctx): Value {
    // NOTE We should always infer target,
    //   but we do a simple check for the simple nat.
    check(ctx, this.target, new NatValue())
    const motive_t = evaluate(new Env(), new Pi("x", new Nat(), new Type()))
    check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), this.motive)
    check(ctx, this.base, Ap.apply(motive_value, new ZeroValue()))
    check(ctx, this.step, nat_ind_step_t(motive_value))
    const target_value = evaluate(ctx.to_env(), this.target)
    return Ap.apply(motive_value, target_value)
  }

  repr(): string {
    return `nat_ind(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `nat_ind(${this.target.alpha_repr(ctx)}, ${this.motive.alpha_repr(
      ctx
    )}, ${this.base.alpha_repr(ctx)}, ${this.step.alpha_repr(ctx)})`
  }

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    if (target instanceof ZeroValue) {
      return base
    } else if (target instanceof Add1Value) {
      return Ap.apply(
        Ap.apply(step, target.prev),
        NatInd.apply(target.prev, motive, base, step)
      )
    } else if (target instanceof NotYetValue) {
      if (target.t instanceof NatValue) {
        const motive_t = new PiValue(
          new NatValue(),
          Closure.create(new Env(), "k", new Type())
        )
        const base_t = Ap.apply(motive, new ZeroValue())
        const step_t = nat_ind_step_t(motive)
        return new NotYetValue(
          Ap.apply(motive, target),
          new NatIndNeutral(
            target.neutral,
            new Normal(motive_t, motive),
            new Normal(base_t, base),
            new Normal(step_t, step)
          )
        )
      } else {
        throw new Trace(
          Explain.explain_elim_target_type_mismatch({
            elim: "nat_ind",
            expecting: ["new NatValue()"],
            reality: target.t.constructor.name,
          })
        )
      }
    } else {
      throw new Trace(
        Explain.explain_elim_target_mismatch({
          elim: "nat_ind",
          expecting: ["Value.zero", "Value.add1", "new NotYetValue"],
          reality: target.constructor.name,
        })
      )
    }
  }
}
