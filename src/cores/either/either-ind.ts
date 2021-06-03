import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import * as Cores from "../../cores"
import {
  either_ind_motive_t,
  either_ind_base_left_t,
  either_ind_base_right_t,
} from "../../exps/either/either-ind"

export class EitherInd extends Core {
  target: Core
  motive: Core
  base_left: Core
  base_right: Core

  constructor(target: Core, motive: Core, base_left: Core, base_right: Core) {
    super()
    this.target = target
    this.motive = motive
    this.base_left = base_left
    this.base_right = base_right
  }

  evaluate(env: Env): Value {
    return EitherInd.apply(
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base_left),
      evaluate(env, this.base_right)
    )
  }

  repr(): string {
    const args = [
      this.target.repr(),
      this.motive.repr(),
      this.base_left.repr(),
      this.base_right.repr(),
    ].join(", ")

    return `either_ind(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [
      this.target.alpha_repr(ctx),
      this.motive.alpha_repr(ctx),
      this.base_left.alpha_repr(ctx),
      this.base_right.alpha_repr(ctx),
    ].join(", ")

    return `either_ind(${args})`
  }

  static apply(
    target: Value,
    motive: Value,
    base_left: Value,
    base_right: Value
  ): Value {
    return Value.match(target, [
      [
        Cores.InlValue,
        ({ left }: Cores.InlValue) => Cores.Ap.apply(base_left, left),
      ],
      [
        Cores.InrValue,
        ({ right }: Cores.InrValue) => Cores.Ap.apply(base_right, right),
      ],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          Value.match(t, [
            [
              Cores.EitherValue,
              (either_t: Cores.EitherValue) => {
                const motive_t = either_ind_motive_t(either_t)
                const base_left_t = either_ind_base_left_t(
                  either_t.left_t,
                  motive
                )
                const base_right_t = either_ind_base_right_t(
                  either_t.right_t,
                  motive
                )
                return new Cores.NotYetValue(
                  Cores.Ap.apply(motive, target),
                  new Cores.EitherIndNeutral(
                    neutral,
                    new Normal(motive_t, motive),
                    new Normal(base_left_t, base_left),
                    new Normal(base_right_t, base_right)
                  )
                )
              },
            ],
          ]),
      ],
    ])
  }
}
