import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp, ExpMeta, subst } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class Either extends Exp {
  meta: ExpMeta
  left_t: Exp
  right_t: Exp

  constructor(left_t: Exp, right_t: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.left_t = left_t
    this.right_t = right_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.left_t.free_names(bound_names),
      ...this.right_t.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Either(
      subst(this.left_t, name, exp),
      subst(this.right_t, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const left_t_core = check(ctx, this.left_t, new Exps.TypeValue())
    const right_t_core = check(ctx, this.right_t, new Exps.TypeValue())

    return {
      t: new Exps.TypeValue(),
      core: new Exps.EitherCore(left_t_core, right_t_core),
    }
  }

  format(): string {
    const args = [this.left_t.format(), this.right_t.format()].join(", ")

    return `Either(${args})`
  }
}
