import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { readback } from "../../readback"
import { Value } from "../../value"
import * as Cores from "../../cores"
import * as Exps from "../../exps"
import { nanoid } from "nanoid"
import { nat_ind_step_t } from "./nat-rec"

export class NatWhich extends Exp {
  target: Exp
  base: Exp
  step: Exp

  constructor(target: Exp, base: Exp, step: Exp) {
    super()
    this.target = target
    this.base = base
    this.step = step
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const target_core = check(ctx, this.target, new Cores.NatValue())
    const inferred_base = infer(ctx, this.base)
    const base_t_core = readback(ctx, new Cores.TypeValue(), inferred_base.t)
    const target_name = "nat_which_target_nat_" + nanoid().toString()
    const motive_core = new Cores.Pi(target_name, new Cores.Nat(), base_t_core)
    const prev_name = "nat_which_prev_" + nanoid().toString()
    const almost_name = "nat_which_almost_" + nanoid().toString()
    const ind_step = new Exps.Fn(prev_name, new Exps.Fn(almost_name, this.step))
    const step_core = check(ctx, ind_step, nat_ind_step_t(inferred_base.t))

    return {
      t: inferred_base.t,
      core: new Cores.NatInd(
        target_core,
        motive_core,
        inferred_base.core,
        step_core
      ),
    }
  }

  repr(): string {
    return `nat_iter(${this.target.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }
}
