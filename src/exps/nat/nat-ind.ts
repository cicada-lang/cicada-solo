import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class NatInd extends Exp {
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

  substitute(name: string, exp: Exp): Exp {
    return new NatInd(
      this.target.substitute(name, exp),
      this.motive.substitute(name, exp),
      this.base.substitute(name, exp),
      this.step.substitute(name, exp)
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const target_core = check(ctx, this.target, new Exps.NatValue())
    const motive_t = nat_ind_motive_t
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)
    const base_core = check(
      ctx,
      this.base,
      Exps.ApCore.apply(motive_value, new Exps.ZeroValue())
    )
    const step_core = check(ctx, this.step, nat_ind_step_t(motive_value))
    const target_value = evaluate(ctx.to_env(), target_core)

    return {
      t: Exps.ApCore.apply(motive_value, target_value),
      core: new Exps.NatIndCore(target_core, motive_core, base_core, step_core),
    }
  }

  repr(): string {
    const args = [
      this.target.repr(),
      this.motive.repr(),
      this.base.repr(),
      this.step.repr(),
    ].join(", ")

    return `nat_ind(${args})`
  }
}

export const nat_ind_motive_t: Value = evaluate(
  Env.empty,
  new Exps.PiCore("target_nat", new Exps.NatCore(), new Exps.TypeCore())
)

export function nat_ind_step_t(motive: Value): Value {
  return evaluate(
    Env.empty.extend("motive", motive),
    new Exps.PiCore(
      "prev",
      new Exps.NatCore(),
      new Exps.PiCore(
        "almost",
        new Exps.ApCore(new Exps.VarCore("motive"), new Exps.VarCore("prev")),
        new Exps.ApCore(
          new Exps.VarCore("motive"),
          new Exps.Add1Core(new Exps.VarCore("prev"))
        )
      )
    )
  )
}
