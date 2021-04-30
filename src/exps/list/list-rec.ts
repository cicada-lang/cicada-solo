import { Exp, AlphaCtx } from "../../exp"
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
import { Type, TypeValue } from "../../exps"
import { Var, Pi, Ap } from "../../exps"
import {
  ListValue,
  Nil,
  NilValue,
  List,
  Li,
  LiValue,
  ListInd,
  ListIndNeutral,
} from "../../exps"
import { PiValue } from "../../exps"
import { NotYetValue } from "../../exps"

export class ListRec extends Exp {
  target: Exp
  base: Exp
  step: Exp

  constructor(target: Exp, base: Exp, step: Exp) {
    super()
    this.target = target
    this.base = base
    this.step = step
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return ListRec.apply(
      evaluate(ctx, env, this.target),
      evaluate(ctx, env, this.base),
      evaluate(ctx, env, this.step)
    )
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)
    const list_t = expect(ctx, target_t, ListValue)
    const elem_t = list_t.elem_t
    const base_t = infer(ctx, this.base)
    check(ctx, this.step, list_rec_step_t(base_t, elem_t))
    return base_t
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
      [NilValue, (_: NilValue) => base],
      [
        LiValue,
        ({ head, tail }: LiValue) =>
          Ap.apply(
            Ap.apply(Ap.apply(step, head), tail),
            ListRec.apply(tail, base, step)
          ),
      ],
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              ListValue,
              (list_t: ListValue) => {
                const motive_t = new PiValue(
                  list_t,
                  new Closure(
                    new Ctx(),
                    new Env(),
                    "target_list",
                    list_t,
                    new Type()
                  )
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
  const ctx = new Ctx()
    .extend("base_t", new TypeValue(), base_t)
    .extend("elem_t", new TypeValue(), elem_t)
  const env = new Env()
    .extend("base_t", new TypeValue(), base_t)
    .extend("elem_t", new TypeValue(), elem_t)

  const step_t = new Pi(
    "head",
    new Var("elem_t"),
    new Pi(
      "tail",
      new List(new Var("elem_t")),
      new Pi("almost", new Var("base_t"), new Var("base_t"))
    )
  )

  return evaluate(ctx, env, step_t)
}
