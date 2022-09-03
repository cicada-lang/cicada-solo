import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { ElaborationError } from "../../errors"
import { check_by_infer, Exp, ExpMeta } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class Var extends Exp {
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
    const found_t = ctx.findType(this.name)
    if (found_t !== undefined) {
      if (found_t instanceof Exps.VaguePiValue) {
        return found_t.vague_inserter.insert_vague_ap(
          ctx,
          new Exps.VarCore(this.name),
          [],
          t,
        )
      }

      return check_by_infer(ctx, this, t)
    }

    const global_value = Exps.globals.findValue(this.name)
    if (global_value !== undefined) {
      global_value.before_check(ctx, [], t)

      const global_t = global_value.self_type()
      if (global_t instanceof Exps.VaguePiValue) {
        return global_t.vague_inserter.insert_vague_ap(
          ctx,
          new Exps.GlobalCore(this.name),
          [],
          t,
        )
      }

      return check_by_infer(ctx, this, t)
    }

    throw new ElaborationError(`I meet undefined variable name: ${this.name}`)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const found_t = ctx.findType(this.name)
    if (found_t !== undefined) {
      return {
        t: found_t,
        core: new Exps.VarCore(this.name),
      }
    }

    const global_value = Exps.globals.findValue(this.name)
    if (global_value !== undefined) {
      return {
        t: global_value.self_type(),
        core: new Exps.GlobalCore(this.name),
      }
    }

    throw new ElaborationError(`I meet undefined variable name: ${this.name}`)
  }

  format(): string {
    return this.name
  }
}
