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

export class Replace extends Exp {
  target: Exp
  motive: Exp
  base: Exp

  constructor(target: Exp, motive: Exp, base: Exp) {
    super()
    this.target = target
    this.motive = motive
    this.base = base
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const equal = expect(ctx, inferred_target.t, Cores.EqualValue)
    const motive_t = evaluate(
      new Env().extend("t", equal.t),
      new Cores.Pi("x", new Cores.Var("t"), new Cores.Type())
    )
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)
    const base_core = check(
      ctx,
      this.base,
      Cores.Ap.apply(motive_value, equal.from)
    )
    const t = Cores.Ap.apply(motive_value, equal.to)
    const core = new Cores.Replace(inferred_target.core, motive_core, base_core)
    return { t, core }
  }

  repr(): string {
    return `replace(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()})`
  }
}
