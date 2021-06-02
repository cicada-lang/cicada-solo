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

export class ListInd extends Core {
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
    return ListInd.apply(
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

    return `list_ind(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [
      this.target.alpha_repr(ctx),
      this.motive.alpha_repr(ctx),
      this.base.alpha_repr(ctx),
      this.step.alpha_repr(ctx),
    ].join(", ")

    return `list_ind(${args})`
  }

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    return match_value(target, [
      [Cores.NilValue, (_: Cores.NilValue) => base],
      [
        Cores.LiValue,
        ({ head, tail }: Cores.LiValue) =>
          Cores.Ap.apply(
            Cores.Ap.apply(Cores.Ap.apply(step, head), tail),
            Cores.ListInd.apply(tail, motive, base, step)
          ),
      ],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          match_value(t, [
            [
              Cores.ListValue,
              (list_t: Cores.ListValue) => {
                const motive_t = new Cores.PiValue(
                  list_t,
                  new Closure(new Env(), "target_list", new Cores.Type())
                )
                const base_t = Cores.Ap.apply(motive, new Cores.NilValue())
                const elem_t = list_t.elem_t
                const step_t = list_ind_step_t(motive_t, motive, elem_t)
                return new Cores.NotYetValue(
                  Cores.Ap.apply(motive, target),
                  new Cores.ListIndNeutral(
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

function list_ind_step_t(motive_t: Value, motive: Value, elem_t: Value): Value {
  return evaluate(
    new Env().extend("motive", motive).extend("elem_t", elem_t),
    new Cores.Pi(
      "head",
      new Cores.Var("elem_t"),
      new Cores.Pi(
        "tail",
        new Cores.List(new Cores.Var("elem_t")),
        new Cores.Pi(
          "almost",
          new Cores.Ap(new Cores.Var("motive"), new Cores.Var("tail")),
          new Cores.Ap(
            new Cores.Var("motive"),
            new Cores.Li(new Cores.Var("head"), new Cores.Var("tail"))
          )
        )
      )
    )
  )
}
