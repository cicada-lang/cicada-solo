import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import { Type } from "../../cores"
import { Nat } from "../../cores"
import { Var, Pi, Ap } from "../../cores"
import {
  Add1,
  NatValue,
  ZeroValue,
  Add1Value,
  NatIndNeutral,
} from "../../cores"
import { PiValue } from "../../cores"
import { NotYetValue } from "../../cores"

export class NatInd implements Core {
  target: Core
  motive: Core
  base: Core
  step: Core

  constructor(target: Core, motive: Core, base: Core, step: Core) {
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return NatInd.apply(
      evaluate(ctx, env, this.target),
      evaluate(ctx, env, this.motive),
      evaluate(ctx, env, this.base),
      evaluate(ctx, env, this.step)
    )
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
              (nat_t: NatValue) => {
                const motive_t = new PiValue(
                  nat_t,
                  new Closure(
                    new Ctx(),
                    new Env(),
                    "target_nat",
                    nat_t,
                    new Type()
                  )
                )
                const base_t = Ap.apply(motive, new ZeroValue())
                const step_t = nat_ind_step_t(motive_t, motive)
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
}

function nat_ind_step_t(motive_t: Value, motive: Value): Value {
  const ctx = new Ctx().extend("motive", motive_t, motive)
  const env = new Env().extend("motive", motive_t, motive)

  const step_t = new Pi(
    "prev",
    new Nat(),
    new Pi(
      "almost",
      new Ap(new Var("motive"), new Var("prev")),
      new Ap(new Var("motive"), new Add1(new Var("prev")))
    )
  )

  return evaluate(ctx, env, step_t)
}
