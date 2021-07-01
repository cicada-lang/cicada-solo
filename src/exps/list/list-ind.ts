import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { check } from "../../check"
import { infer } from "../../exp"
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

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.motive.free_names(bound_names),
      ...this.base.free_names(bound_names),
      ...this.step.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new ListInd(
      this.target.subst(name, exp),
      this.motive.subst(name, exp),
      this.base.subst(name, exp),
      this.step.subst(name, exp)
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const list_t = expect(ctx, inferred_target.t, Cores.ListValue)
    const elem_t = list_t.elem_t
    const motive_t = list_ind_motive_t(elem_t)
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)
    const base_core = check(
      ctx,
      this.base,
      Cores.Ap.apply(motive_value, new Cores.NilValue())
    )
    const step_t = list_ind_step_t(motive_value, elem_t)
    const step_core = check(ctx, this.step, step_t)
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
    const args = [
      this.target.repr(),
      this.motive.repr(),
      this.base.repr(),
      this.step.repr(),
    ].join(", ")

    return `list_ind(${args})`
  }
}

export function list_ind_motive_t(elem_t: Value): Value {
  return evaluate(
    new Env().extend("elem_t", elem_t),
    new Cores.Pi(
      "target_list",
      new Cores.List(new Cores.Var("elem_t")),
      new Cores.Type()
    )
  )
}

export function list_ind_step_t(motive: Value, elem_t: Value): Value {
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
