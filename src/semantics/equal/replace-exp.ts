import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { infer } from "../../exp"
import { expect } from "../../value"
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

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.motive.free_names(bound_names),
      ...this.base.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Replace(
      this.target.subst(name, exp),
      this.motive.subst(name, exp),
      this.base.subst(name, exp)
    )
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

    return {
      t: Cores.Ap.apply(motive_value, equal.to),
      core: new Cores.Replace(inferred_target.core, motive_core, base_core),
    }
  }

  repr(): string {
    return `replace(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()})`
  }
}
