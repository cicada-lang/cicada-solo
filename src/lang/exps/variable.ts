import * as Exps from "."
import { Core } from "../core"
import { Ctx } from "../ctx"
import { ExpTrace } from "../errors"
import { check_by_infer, Exp, ExpMeta } from "../exp"
import { Value } from "../value"

export class Variable extends Exp {
  meta?: ExpMeta
  name: string

  constructor(name: string, meta?: ExpMeta) {
    super()
    this.meta = meta
    this.name = name
  }

  free_names(bound_names: Set<string>): Set<string> {
    if (bound_names.has(this.name)) {
      return new Set()
    } else {
      return new Set([this.name])
    }
  }

  subst(name: string, exp: Exp): Exp {
    if (name === this.name) {
      // TODO How to handle `span` when doing a `subst`
      return exp
    } else {
      return this
    }
  }

  check(ctx: Ctx, t: Value): Core {
    const found_t = ctx.find_type(this.name)

    if (found_t instanceof Exps.VaguePiValue) {
      return found_t.vague_inserter.insert_vague_ap(
        ctx,
        new Exps.VariableCore(this.name),
        [],
        t
      )
    }

    return check_by_infer(ctx, this, t)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const built_in_t = Exps.built_ins.find_type(this.name)
    if (built_in_t !== undefined) {
      return { t: built_in_t, core: new Exps.BuiltInCore(this.name) }
    }

    const t = ctx.find_type(this.name)
    if (t !== undefined) {
      return { t, core: new Exps.VariableCore(this.name) }
    }

    throw new ExpTrace(`I meet undefined variable name: ${this.name}`)
  }

  format(): string {
    return this.name
  }
}
