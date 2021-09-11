import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { infer } from "../../exp"
import { readback } from "../../value"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"
import { nanoid } from "nanoid"

export class NatRec extends Exp {
  target: Exp
  base: Exp
  step: Exp

  constructor(target: Exp, base: Exp, step: Exp) {
    super()
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
    return new NatRec(
      this.target.subst(name, exp),
      this.base.subst(name, exp),
      this.step.subst(name, exp)
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const target_core = check(ctx, this.target, new Exps.NatValue())
    const inferred_base = infer(ctx, this.base)
    const base_t_core = readback(ctx, new Exps.TypeValue(), inferred_base.t)
    const target_name = "nat_rec_target_nat_" + nanoid().toString()
    const motive_core = new Exps.TheCore(
      new Exps.PiCore(target_name, new Exps.TypeCore(), new Exps.NatCore()),
      new Exps.FnCore(target_name, base_t_core)
    )
    const step_core = check(ctx, this.step, nat_ind_step_t(inferred_base.t))

    return {
      t: inferred_base.t,
      core: new Exps.NatIndCore(
        target_core,
        motive_core,
        inferred_base.core,
        step_core
      ),
    }
  }

  repr(): string {
    return `nat_rec(${this.target.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }
}

function nat_ind_step_t(base_t: Value): Value {
  return evaluate(
    Env.empty.extend("base_t", base_t),
    new Exps.PiCore(
      "prev",
      new Exps.NatCore(),
      new Exps.PiCore(
        "almost",
        new Exps.VarCore("base_t"),
        new Exps.VarCore("base_t")
      )
    )
  )
}
