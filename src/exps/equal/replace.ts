import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import * as Exps from "../../exps"
import * as Cores from "../../cores"

export class Replace extends Exp {
  target: Exp
  motive: Exp
  base: Exp

  constructor(target: Exp, motive: Exp, base: Exp) {
    super()
    this.target = target
    this.motive = motive
    this.base = base
  }

  evaluate(env: Env): Value {
    return Replace.apply(
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base)
    )
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)
    const equal = expect(ctx, target_t, Cores.EqualValue)
    const motive_t = evaluate(
      new Env().extend("t", equal.t),
      new Exps.Pi("x", new Exps.Var("t"), new Exps.Type())
    )
    check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), this.motive)
    check(ctx, this.base, Cores.Ap.apply(motive_value, equal.from))
    return Cores.Ap.apply(motive_value, equal.to)
  }

  repr(): string {
    return `replace(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()})`
  }

  static apply(target: Value, motive: Value, base: Value): Value {
    return match_value(target, [
      [Cores.SameValue, (_: Cores.SameValue) => base],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          match_value(t, [
            [
              Cores.EqualValue,
              ({ t, to, from }: Cores.EqualValue) => {
                const base_t = Cores.Ap.apply(motive, from)
                const motive_t = new Cores.PiValue(
                  t,
                  new Closure(new Env(), "x", new Exps.Type())
                )
                return new Cores.NotYetValue(
                  Cores.Ap.apply(motive, to),
                  new Cores.ReplaceNeutral(
                    neutral,
                    new Normal(motive_t, motive),
                    new Normal(base_t, base)
                  )
                )
              },
            ],
          ]),
      ],
    ])
  }
}
