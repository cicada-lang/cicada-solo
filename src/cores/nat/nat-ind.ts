import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import * as Cores from "../../cores"
import { nat_ind_motive_t, nat_ind_step_t } from "../../exps/nat/nat-ind"

export class NatInd extends Core {
  target: Core
  motive: Core
  base: Core
  step: Core

  constructor(target: Core, motive: Core, base: Core, step: Core) {
    super()
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

  repr(): string {
    const args = [
      this.target.repr(),
      this.motive.repr(),
      this.base.repr(),
      this.step.repr(),
    ].join(", ")

    return `nat_ind(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [
      this.target.alpha_repr(ctx),
      this.motive.alpha_repr(ctx),
      this.base.alpha_repr(ctx),
      this.step.alpha_repr(ctx),
    ].join(", ")

    return `nat_ind(${args})`
  }

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    return Value.match(target, [
      [Cores.ZeroValue, (_: Cores.ZeroValue) => base],
      [
        Cores.Add1Value,
        ({ prev }: Cores.Add1Value) =>
          Cores.Ap.apply(
            Cores.Ap.apply(step, prev),
            Cores.NatInd.apply(prev, motive, base, step)
          ),
      ],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          Value.match(t, [
            [
              Cores.NatValue,
              (nat_t: Cores.NatValue) => {
                const motive_t = nat_ind_motive_t
                const base_t = Cores.Ap.apply(motive, new Cores.ZeroValue())
                const step_t = nat_ind_step_t(motive)
                return new Cores.NotYetValue(
                  Cores.Ap.apply(motive, target),
                  new Cores.NatIndNeutral(
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
