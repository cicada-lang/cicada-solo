import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import * as Cores from "../../cores"

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
    return `nat_ind(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `nat_ind(${this.target.alpha_repr(ctx)}, ${this.motive.alpha_repr(
      ctx
    )}, ${this.base.alpha_repr(ctx)}, ${this.step.alpha_repr(ctx)})`
  }

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    return match_value(target, [
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
          match_value(t, [
            [
              Cores.NatValue,
              (nat_t: Cores.NatValue) => {
                const motive_t = new Cores.PiValue(
                  nat_t,
                  new Closure(new Env(), "target_nat", new Cores.Type())
                )
                const base_t = Cores.Ap.apply(motive, new Cores.ZeroValue())
                const step_t = nat_ind_step_t(motive_t, motive)
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

function nat_ind_step_t(motive_t: Value, motive: Value): Value {
  const ctx = new Ctx().extend("motive", motive)
  const env = new Env().extend("motive", motive)

  const step_t = new Cores.Pi(
    "prev",
    new Cores.Nat(),
    new Cores.Pi(
      "almost",
      new Cores.Ap(new Cores.Var("motive"), new Cores.Var("prev")),
      new Cores.Ap(
        new Cores.Var("motive"),
        new Cores.Add1(new Cores.Var("prev"))
      )
    )
  )

  return evaluate(env, step_t)
}
