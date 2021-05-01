import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import * as Exps from "../../exps"
import * as Cores from "../../cores"

export class NatInd extends Exp {
  target: Exp
  motive: Exp
  base: Exp
  step: Exp

  constructor(target: Exp, motive: Exp, base: Exp, step: Exp) {
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

  infer(ctx: Ctx): Value {
    // NOTE We should always infer target,
    //   but we do a simple check for the simple nat.
    check(ctx, this.target, new Cores.NatValue())
    const motive_t = evaluate(
      new Env(),
      new Exps.Pi("target_nat", new Exps.Nat(), new Exps.Type())
    )
    check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), this.motive)
    check(ctx, this.base, Cores.Ap.apply(motive_value, new Cores.ZeroValue()))
    check(ctx, this.step, nat_ind_step_t(motive_t, motive_value))
    const target_value = evaluate(ctx.to_env(), this.target)
    return Cores.Ap.apply(motive_value, target_value)
  }

  repr(): string {
    return `nat_ind(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    return match_value(target, [
      [Cores.ZeroValue, (_: Cores.ZeroValue) => base],
      [
        Cores.Add1Value,
        ({ prev }: Cores.Add1Value) =>
          Cores.Ap.apply(
            Cores.Ap.apply(step, prev),
            NatInd.apply(prev, motive, base, step)
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
                  new Closure(new Env(), "target_nat", new Exps.Type())
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
  const env = new Env().extend("motive", motive)

  const step_t = new Exps.Pi(
    "prev",
    new Exps.Nat(),
    new Exps.Pi(
      "almost",
      new Exps.Ap(new Exps.Var("motive"), new Exps.Var("prev")),
      new Exps.Ap(new Exps.Var("motive"), new Exps.Add1(new Exps.Var("prev")))
    )
  )

  return evaluate(env, step_t)
}
