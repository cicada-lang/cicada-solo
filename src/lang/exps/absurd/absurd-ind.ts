import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class AbsurdInd extends Exp {
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
    return new AbsurdInd(
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
      core: new Exps.AbsurdIndCore(target_core, motive_core),
    }
  }

  format(): string {
    return `absurd_ind(${this.target.format()}, ${this.motive.format()})`
  }
}
