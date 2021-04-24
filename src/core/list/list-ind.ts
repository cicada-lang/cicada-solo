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
import { Type } from "../../core"
import { Var, Pi, Ap } from "../../core"
import {
  ListValue,
  Nil,
  NilValue,
  List,
  Li,
  LiValue,
  ListIndNeutral,
} from "../../core"
import { PiValue } from "../../core"
import { NotYetValue } from "../../core"

export class ListInd implements Exp {
  target: Exp
  motive: Exp
  base: Exp
  step: Exp

  constructor(target: Exp, motive: Exp, base: Exp, step: Exp) {
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

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)
    const list_t = expect(ctx, target_t, ListValue)
    const elem_t = list_t.elem_t
    const motive_t = evaluate(
      new Env().extend("elem_t", elem_t),
      new Pi("target_list", new List(new Var("elem_t")), new Type())
    )
    check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), this.motive)
    check(ctx, this.base, Ap.apply(motive_value, new NilValue()))
    check(ctx, this.step, list_ind_step_t(motive_value, elem_t))
    const target_value = evaluate(ctx.to_env(), this.target)
    return Ap.apply(motive_value, target_value)
  }

  repr(): string {
    return `list_ind(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `list_ind(${this.target.alpha_repr(ctx)}, ${this.motive.alpha_repr(
      ctx
    )}, ${this.base.alpha_repr(ctx)}, ${this.step.alpha_repr(ctx)})`
  }

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    return match_value(target, [
      [NilValue, (_: NilValue) => base],
      [
        LiValue,
        ({ head, tail }: LiValue) =>
          Ap.apply(
            Ap.apply(Ap.apply(step, head), tail),
            ListInd.apply(tail, motive, base, step)
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
                  new Closure(new Env(), "target_list", new Type())
                )
                const base_t = Ap.apply(motive, new NilValue())
                const elem_t = list_t.elem_t
                const step_t = list_ind_step_t(motive, elem_t)
                return new NotYetValue(
                  Ap.apply(motive, target),
                  new ListIndNeutral(
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

function list_ind_step_t(motive: Value, elem_t: Value): Value {
  const env = new Env().extend("motive", motive).extend("elem_t", elem_t)

  const step_t = new Pi(
    "head",
    new Var("elem_t"),
    new Pi(
      "tail",
      new List(new Var("elem_t")),
      new Pi(
        "almost",
        new Ap(new Var("motive"), new Var("tail")),
        new Ap(new Var("motive"), new Li(new Var("head"), new Var("tail")))
      )
    )
  )

  return evaluate(env, step_t)
}
