import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
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
    const found_t = ctx.find_type(this.name)
    if (found_t !== undefined) {
      if (found_t instanceof Exps.VaguePiValue) {
        return found_t.vague_inserter.insert_vague_ap(
          ctx,
          new Exps.VarCore(this.name),
          [],
          t
        )
      }

      return check_by_infer(ctx, this, t)
    }

    const built_in_value = Exps.built_ins.find_value(this.name)
    if (built_in_value !== undefined) {
      built_in_value.before_check(ctx, [], t)

      const built_in_t = built_in_value.self_type()
      if (built_in_t instanceof Exps.VaguePiValue) {
        return built_in_t.vague_inserter.insert_vague_ap(
          ctx,
          new Exps.BuiltInCore(this.name),
          [],
          t
        )
      }

      return check_by_infer(ctx, this, t)
    }

    throw new ExpTrace(`I meet undefined variable name: ${this.name}`)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const found_t = ctx.find_type(this.name)
    if (found_t !== undefined) {
      return {
        t: found_t,
        core: new Exps.VarCore(this.name),
      }
    }

    const built_in_value = Exps.built_ins.find_value(this.name)
    if (built_in_value !== undefined) {
      return {
        t: built_in_value.self_type(),
        core: new Exps.BuiltInCore(this.name),
      }
    }

    throw new ExpTrace(`I meet undefined variable name: ${this.name}`)
  }

  format(): string {
    return this.name
  }
}
