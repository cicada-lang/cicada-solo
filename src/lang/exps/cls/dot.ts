import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import { readback } from "../../value"
import { infer } from "../../exp"
import { ExpTrace } from "../../errors"
import * as ut from "../../../ut"
import * as Exps from "../../exps"

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

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred = infer(ctx, this.target)

    if (inferred.t instanceof Exps.ClsValue) {
      // NOTE `infer` need to return normalized value as core.
      // Because of `ClsValue` can be partially fulfilled by value,
      // during `infer` of `Exps.Dot`, we have opportunity to get those value back,
      // and return them as core.
      const target_value = evaluate(ctx.to_env(), inferred.core)
      const value = inferred.t.dot_value(target_value, this.name)
      const t = inferred.t.dot_type(target_value, this.name)
      return {
        t,
        core: readback(ctx, t, value),
      }
    }

    throw new ExpTrace(
      [
        `I expect the inferred type to be a class.`,
        `  class name: ${inferred.t.constructor.name}`,
      ].join("\n")
    )
  }

  format(): string {
    return `${this.target.format()}.${this.name}`
  }
}
