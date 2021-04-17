import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import { Trace } from "../../trace"
import { Type } from "../../core"
import { Nat } from "../../core"
import { Pi, Ap } from "../../core"
import { NatValue, ZeroValue, Add1Value, NatIndNeutral } from "../../core"
import { PiValue } from "../../core"
import { NotYetValue } from "../../core"
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

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    return match_value(target, [
      [ZeroValue, (_: ZeroValue) => base],
      [
        Add1Value,
        ({ prev }: Add1Value) =>
          Ap.apply(
            Ap.apply(step, prev),
            NatInd.apply(prev, motive, base, step)
          ),
      ],
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              NatValue,
              (_: NatValue) => {
                const motive_t = new PiValue(
                  new NatValue(),
                  new Closure(new Env(), "k", new Type())
                )
                const base_t = Ap.apply(motive, new ZeroValue())
                const step_t = nat_ind_step_t(motive)
                return new NotYetValue(
                  Ap.apply(motive, target),
                  new NatIndNeutral(
                    neutral,
                    new Normal(motive_t, motive),
                    new Normal(base_t, base),
                    new Normal(step_t, step)
                  )
                )
              },
            ],
          ]),
      ],
    ])
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
}
