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

export class Replace extends Exp {
  meta: ExpMeta
  target: Exp
  motive: Exp
  base: Exp

  constructor(target: Exp, motive: Exp, base: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
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
      subst(this.target, name, exp),
      subst(this.motive, name, exp),
      subst(this.base, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const equal = expect(ctx, inferred_target.t, Exps.EqualValue)
    const motive_t = evaluate(
      Env.init().extend("t", equal.t),
      new Exps.PiCore("x", new Exps.VarCore("t"), new Exps.TypeCore())
    )
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)
    const base_core = check(
      ctx,
      this.base,
      Exps.ApCore.apply(motive_value, equal.from)
    )

    return {
      t: Exps.ApCore.apply(motive_value, equal.to),
      core: new Exps.ReplaceCore(inferred_target.core, motive_core, base_core),
    }
  }

  repr(): string {
    return `replace(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()})`
  }
}
