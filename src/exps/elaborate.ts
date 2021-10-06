import { Exp, ExpMeta, ElaborationOptions, subst } from "../exp"
import { ElaborationNarrator } from "../elaboration-narrator"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { Value } from "../value"
import { evaluate } from "../core"
import { check, infer } from "../exp"
import * as Exps from "../exps"

export class Elaborate extends Exp {
  meta: ExpMeta
  exp: Exp

  constructor(exp: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.exp = exp
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.exp.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Elaborate {
    return new Elaborate(subst(this.exp, name, exp), this.meta)
  }

  check(ctx: Ctx, t: Value): Core {
    return check(ctx, this.exp, t, {
      narrator: new ElaborationNarrator(),
    })
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return infer(ctx, this.exp, {
      narrator: new ElaborationNarrator(),
    })
  }

  repr(): string {
    return `@elaborate ${this.exp.repr()}`
  }
}
