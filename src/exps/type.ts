import { Core } from "../core"
import { Exp, subst } from "../exp"
import { Ctx } from "../ctx"
import { Value } from "../value"
import * as Exps from "../exps"
import pt from "@cicada-lang/partech"

export class Type extends Exp {
  meta?: { span?: pt.Span }

  constructor(meta?: { span?: pt.Span }) {
    super()
    this.meta = meta
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): this {
    return this
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.TypeValue(),
      core: new Exps.TypeCore(),
    }
  }

  repr(): string {
    return "Type"
  }
}
