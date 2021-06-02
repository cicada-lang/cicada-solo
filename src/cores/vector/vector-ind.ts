import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import { Trace } from "../../trace"
import * as Cores from "../../cores"
import {
  vector_ind_motive_t,
  vector_ind_step_t,
} from "../../exps/vector/vector-ind"

export class VectorInd extends Core {
  length: Core
  target: Core
  motive: Core
  base: Core
  step: Core

  constructor(
    length: Core,
    target: Core,
    motive: Core,
    base: Core,
    step: Core
  ) {
    super()
    this.length = length
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  evaluate(env: Env): Value {
    return VectorInd.apply(
      evaluate(env, this.length),
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base),
      evaluate(env, this.step)
    )
  }

  repr(): string {
    const args = [
      this.length.repr(),
      this.target.repr(),
      this.motive.repr(),
      this.base.repr(),
      this.step.repr(),
    ].join(", ")

    return `vector_ind(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [
      this.length.alpha_repr(ctx),
      this.target.alpha_repr(ctx),
      this.motive.alpha_repr(ctx),
      this.base.alpha_repr(ctx),
      this.step.alpha_repr(ctx),
    ].join(", ")

    return `vector_ind(${args})`
  }

  static apply(
    length: Value,
    target: Value,
    motive: Value,
    base: Value,
    step: Value
  ): Value {
    return match_value(target, [
      [Cores.VecnilValue, (_: Cores.VecnilValue) => base],
      [
        Cores.VecValue,
        ({ head, tail }: Cores.VecValue) => {
          const prev = match_value(length, [
            [Cores.Add1Value, ({ prev }: Cores.Add1Value) => prev],
          ])

          return Cores.Ap.apply(
            Cores.Ap.apply(
              Cores.Ap.apply(Cores.Ap.apply(step, length), head),
              tail
            ),
            Cores.VectorInd.apply(prev, tail, motive, base, step)
          )
        },
      ],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          match_value(t, [
            [
              Cores.VectorValue,
              (vector_t: Cores.VectorValue) => {
                const elem_t = vector_t.elem_t
                const length_t = new Cores.NatValue()
                const motive_t = vector_ind_motive_t(elem_t)
                const base_t = Cores.Ap.apply(
                  Cores.Ap.apply(motive, new Cores.ZeroValue()),
                  new Cores.VecnilValue()
                )
                const step_t = vector_ind_step_t(motive, elem_t)
                return new Cores.NotYetValue(
                  Cores.Ap.apply(Cores.Ap.apply(motive, length), target),
                  new Cores.VectorIndNeutral(
                    new Normal(length_t, length),
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
