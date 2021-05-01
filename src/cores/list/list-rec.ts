import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Trace } from "../../trace"
import * as Cores from "../../cores"

export class ListRec extends Core {
  target: Core
  base: Core
  step: Core

  constructor(target: Core, base: Core, step: Core) {
    super()
    this.target = target
    this.base = base
    this.step = step
  }

  evaluate(env: Env): Value {
    return ListRec.apply(
      evaluate(env, this.target),
      evaluate(env, this.base),
      evaluate(env, this.step)
    )
  }

  repr(): string {
    return `list_rec(${this.target.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Trace(
      `ListRec should be readback to ListInd,\n` +
        `thus ListRec.alpha_repr should never be called.`
    )
  }

  static apply(target: Value, base: Value, step: Value): Value {
    return match_value(target, [
      [Cores.NilValue, (_: Cores.NilValue) => base],
      [
        Cores.LiValue,
        ({ head, tail }: Cores.LiValue) =>
          Cores.Ap.apply(
            Cores.Ap.apply(Cores.Ap.apply(step, head), tail),
            Cores.ListRec.apply(tail, base, step)
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

                throw new Error("TODO")

                // NOTE We need to construct a constant motive function to return `base_t`
                //   but we do not have `base_t`.

                // const base_t = ???
                // const motive = ???
                // const elem_t = list_t.elem_t
                // const step_t = list_rec_step_t(base_t, elem_t)
                // return new NotYetValue(
                //   base_t,
                //   new ListIndNeutral(
                //     neutral,
                //     new Normal(motive_t, motive),
                //     new Normal(base_t, base),
                //     new Normal(step_t, step)
                //   )
                // )
              },
            ],
          ]),
      ],
    ])
  }
}

function list_rec_step_t(base_t: Value, elem_t: Value): Value {
  const ctx = new Ctx().extend("base_t", base_t).extend("elem_t", elem_t)
  const env = new Env().extend("base_t", base_t).extend("elem_t", elem_t)

  const step_t = new Cores.Pi(
    "head",
    new Cores.Var("elem_t"),
    new Cores.Pi(
      "tail",
      new Cores.List(new Cores.Var("elem_t")),
      new Cores.Pi("almost", new Cores.Var("base_t"), new Cores.Var("base_t"))
    )
  )

  return evaluate(env, step_t)
}
