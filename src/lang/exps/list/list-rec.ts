import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { readback } from "../../value"
import { infer } from "../../exp"
import { expect } from "../../value"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"
import { nanoid } from "nanoid"

export class ListRec extends Exp {
  meta: ExpMeta
  target: Exp
  base: Exp
  step: Exp

  constructor(target: Exp, base: Exp, step: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.target = target
    this.base = base
    this.step = step
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.base.free_names(bound_names),
      ...this.step.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new ListRec(
      subst(this.target, name, exp),
      subst(this.base, name, exp),
      subst(this.step, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const list_t = expect(ctx, inferred_target.t, Exps.ListValue)
    const elem_t = list_t.elem_t
    const inferred_base = infer(ctx, this.base)
    const target_t_core = readback(ctx, new Exps.TypeValue(), inferred_target.t)
    const base_t_core = readback(ctx, new Exps.TypeValue(), inferred_base.t)
    const target_name = "list_rec_target_list_" + nanoid().toString()
    const motive_core = new Exps.TheCore(
      new Exps.PiCore(target_name, new Exps.TypeCore(), target_t_core),
      new Exps.FnCore(target_name, base_t_core)
    )
    const step_core = check(
      ctx,
      this.step,
      list_rec_step_t(inferred_base.t, elem_t)
    )

    return {
      t: inferred_base.t,
      core: new Exps.ListIndCore(
        inferred_target.core,
        motive_core,
        inferred_base.core,
        step_core
      ),
    }
  }

  repr(): string {
    return `list_rec(${this.target.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }
}

function list_rec_step_t(base_t: Value, elem_t: Value): Value {
  return evaluate(
    Env.init().extend("base_t", base_t).extend("elem_t", elem_t),
    new Exps.PiCore(
      "head",
      new Exps.VarCore("elem_t"),
      new Exps.PiCore(
        "tail",
        new Exps.ListCore(new Exps.VarCore("elem_t")),
        new Exps.PiCore(
          "almost",
          new Exps.VarCore("base_t"),
          new Exps.VarCore("base_t")
        )
      )
    )
  )
}
