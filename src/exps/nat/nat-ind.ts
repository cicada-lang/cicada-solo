import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value } from "../../value"
import * as Cores from "../../cores"

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

  infer(ctx: Ctx): { t: Value; core: Core } {
    const target_core = check(ctx, this.target, new Cores.NatValue())
    const motive_t = evaluate(
      new Env(),
      new Cores.Pi("target_nat", new Cores.Nat(), new Cores.Type())
    )
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)
    const base_core = check(
      ctx,
      this.base,
      Cores.Ap.apply(motive_value, new Cores.ZeroValue())
    )
    const step_core = check(
      ctx,
      this.step,
      nat_ind_step_t(motive_t, motive_value)
    )
    const target_value = evaluate(ctx.to_env(), target_core)

    return {
      t: Cores.Ap.apply(motive_value, target_value),
      core: new Cores.NatInd(target_core, motive_core, base_core, step_core),
    }
  }

  repr(): string {
    return `nat_ind(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }
}

function nat_ind_step_t(motive_t: Value, motive: Value): Value {
  return evaluate(
    new Env().extend("motive", motive),
    new Cores.Pi(
      "prev",
      new Cores.Nat(),
      new Cores.Pi(
        "almost",
        new Cores.Ap(new Cores.Var("motive"), new Cores.Var("prev")),
        new Cores.Ap(
          new Cores.Var("motive"),
          new Cores.Add1(new Cores.Var("prev"))
        )
      )
    )
  )
}
