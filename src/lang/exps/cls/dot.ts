import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { ElaborationError } from "../../errors"
import { check_by_infer, Exp, ExpMeta, infer, subst } from "../../exp"
import * as Exps from "../../exps"
import { readback, Value } from "../../value"

export class Dot extends Exp {
  meta?: ExpMeta
  target: Exp
  name: string

  constructor(target: Exp, name: string, meta?: ExpMeta) {
    super()
    this.meta = meta
    this.target = target
    this.name = name
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.target.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new Dot(subst(this.target, name, exp), this.name, this.meta)
  }

  check(ctx: Ctx, t: Value): Core {
    const inferred = infer(ctx, this)

    if (inferred.t instanceof Exps.VaguePiValue) {
      return inferred.t.vague_inserter.insert_vague_ap(
        ctx,
        inferred.core,
        [],
        t
      )
    }

    return check_by_infer(ctx, this, t)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred = infer(ctx, this.target)

    const target = evaluate(ctx.toEnv(), inferred.core)
    if (target.dot_handler?.infer_by_target) {
      return target.dot_handler.infer_by_target(ctx, inferred.core, this.name)
    }

    if (inferred.t instanceof Exps.ClsValue) {
      // NOTE `infer` need to return normalized value as core.
      // Because of `ClsValue` can be partially fulfilled by value,
      // during `infer` of `Exps.Dot`, we have opportunity to get those value back,
      // and return them as core.
      const target_value = evaluate(ctx.toEnv(), inferred.core)
      const value = inferred.t.get_value(target_value, this.name)
      const t = inferred.t.get_type(target_value, this.name)
      return {
        t,
        core: readback(ctx, t, value),
      }
    }

    throw new ElaborationError(
      [
        `I expect the inferred type to be Exps.ClsValue`,
        `  class name: ${inferred.t.constructor.name}`,
      ].join("\n")
    )
  }

  format(): string {
    return `${this.target.format()}.${this.name}`
  }
}
