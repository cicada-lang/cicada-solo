import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { infer } from "../../exp"
import { expect } from "../../value"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class ListInd extends Exp {
  meta: ExpMeta
  target: Exp
  motive: Exp
  base: Exp
  step: Exp

  constructor(target: Exp, motive: Exp, base: Exp, step: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
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
      subst(this.target, name, exp),
      subst(this.motive, name, exp),
      subst(this.base, name, exp),
      subst(this.step, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const list_t = expect(ctx, inferred_target.t, Exps.ListValue)
    const elem_t = list_t.elem_t
    const motive_t = list_ind_motive_t(elem_t)
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)
    const base_core = check(
      ctx,
      this.base,
      Exps.ApCore.apply(motive_value, new Exps.NilValue())
    )
    const step_t = list_ind_step_t(motive_value, elem_t)
    const step_core = check(ctx, this.step, step_t)
    const target_value = evaluate(ctx.to_env(), inferred_target.core)

    return {
      t: Exps.ApCore.apply(motive_value, target_value),
      core: new Exps.ListIndCore(
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
    Env.init().extend("elem_t", elem_t),
    new Exps.PiCore(
      "target_list",
      new Exps.ListCore(new Exps.VarCore("elem_t")),
      new Exps.TypeCore()
    )
  )
}

export function list_ind_step_t(motive: Value, elem_t: Value): Value {
  return evaluate(
    Env.init().extend("motive", motive).extend("elem_t", elem_t),
    new Exps.PiCore(
      "head",
      new Exps.VarCore("elem_t"),
      new Exps.PiCore(
        "tail",
        new Exps.ListCore(new Exps.VarCore("elem_t")),
        new Exps.PiCore(
          "almost",
          new Exps.ApCore(new Exps.VarCore("motive"), new Exps.VarCore("tail")),
          new Exps.ApCore(
            new Exps.VarCore("motive"),
            new Exps.LiCore(new Exps.VarCore("head"), new Exps.VarCore("tail"))
          )
        )
      )
    )
  )
}
