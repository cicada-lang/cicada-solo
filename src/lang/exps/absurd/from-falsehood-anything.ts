import * as Exps from ".."
import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp, ExpMeta, subst } from "../../exp"
import { Value } from "../../value"

export class FromFalsehoodAnything extends Exp {
  meta: ExpMeta
  target: Exp
  motive: Exp

  constructor(target: Exp, motive: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.target = target
    this.motive = motive
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.motive.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new FromFalsehoodAnything(
      subst(this.target, name, exp),
      subst(this.motive, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    // NOTE the `motive` here is not a function from target_t to type,
    //   but a element of type.
    // NOTE We should always infer target,
    //   but we do a simple check for the simple absurd.
    const target_core = check(ctx, this.target, new Exps.AbsurdValue())
    const motive_core = check(ctx, this.motive, new Exps.TypeValue())

    return {
      t: evaluate(ctx.to_env(), motive_core),
      core: new Exps.FromFalsehoodAnythingCore(target_core, motive_core),
    }
  }

  format(): string {
    return `from_falsehood_anything(${this.target.format()}, ${this.motive.format()})`
  }
}
