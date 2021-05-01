import { Exp } from "../../exp"
import { Core } from "../../core"
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

export class ListInd extends Exp {
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

  infer(ctx: Ctx): { t: Value; core: Core } {
    const target_t = infer(ctx, this.target)
    const list_t = expect(ctx, target_t, Cores.ListValue)
    const elem_t = list_t.elem_t
    const motive_t = evaluate(
      new Env().extend("elem_t", elem_t),
      new Exps.Pi(
        "target_list",
        new Exps.List(new Exps.Var("elem_t")),
        new Exps.Type()
      )
    )
    check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), this.motive)
    check(ctx, this.base, Cores.Ap.apply(motive_value, new Cores.NilValue()))
    check(ctx, this.step, list_ind_step_t(motive_t, motive_value, elem_t))
    const target_value = evaluate(ctx.to_env(), this.target)
    return Cores.Ap.apply(motive_value, target_value)
  }

  repr(): string {
    return `list_ind(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }
}

function list_ind_step_t(motive_t: Value, motive: Value, elem_t: Value): Value {
  const env = new Env().extend("motive", motive).extend("elem_t", elem_t)

  const step_t = new Cores.Pi(
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

  return evaluate(env, step_t)
}
