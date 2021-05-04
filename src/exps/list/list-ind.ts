import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value } from "../../value"
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
    const inferred_target = infer(ctx, this.target)
    const list_t = expect(ctx, inferred_target.t, Cores.ListValue)
    const elem_t = list_t.elem_t
    const motive_t = evaluate(
      new Env().extend("elem_t", elem_t),
      new Cores.Pi(
        "target_list",
        new Cores.List(new Cores.Var("elem_t")),
        new Cores.Type()
      )
    )
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)
    const base_core = check(
      ctx,
      this.base,
      Cores.Ap.apply(motive_value, new Cores.NilValue())
    )
    const step_core = check(
      ctx,
      this.step,
      list_ind_step_t(motive_t, motive_value, elem_t)
    )
    const target_value = evaluate(ctx.to_env(), inferred_target.core)
    return {
      t: Cores.Ap.apply(motive_value, target_value),
      core: new Cores.ListInd(
        inferred_target.core,
        motive_core,
        base_core,
        step_core
      ),
    }
  }

  repr(): string {
    return `list_ind(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()}, ${this.step.repr()})`
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
