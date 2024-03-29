import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp, ExpMeta, infer, subst } from "../../exp"
import { Value } from "../../value"

export class Begin extends Exp {
  meta: ExpMeta
  ret: Exp

  constructor(ret: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.ret = ret
  }

  free_names(bound_names: Set<string>): Set<string> {
    return this.ret.free_names(bound_names)
  }

  subst(name: string, exp: Exp): Begin {
    return new Begin(subst(this.ret, name, exp), this.meta)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return infer(ctx, this.ret)
  }

  check(ctx: Ctx, t: Value): Core {
    return check(ctx, this.ret, t)
  }

  format(): string {
    return `{ ${this.ret.format()} }`
  }
}
