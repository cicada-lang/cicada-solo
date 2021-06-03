import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import * as Cores from "../../cores"

export class Replace extends Core {
  target: Core
  motive: Core
  base: Core

  constructor(target: Core, motive: Core, base: Core) {
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

  repr(): string {
    const args = [
      this.target.repr(),
      this.motive.repr(),
      this.base.repr(),
    ].join(", ")

    return `replace(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [
      this.target.alpha_repr(ctx),
      this.motive.alpha_repr(ctx),
      this.base.alpha_repr(ctx),
    ].join(", ")

    return `replace(${args})`
  }

  static apply(target: Value, motive: Value, base: Value): Value {
    return Value.match(target, [
      [Cores.SameValue, (_: Cores.SameValue) => base],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          Value.match(t, [
            [
              Cores.EqualValue,
              ({ t, to, from }: Cores.EqualValue) => {
                const base_t = Cores.Ap.apply(motive, from)
                const motive_t = new Cores.PiValue(
                  t,
                  new Closure(new Env(), "x", new Cores.Type())
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
