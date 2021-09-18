import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import { readback } from "../../value"
import { infer } from "../../exp"
import { Trace } from "../../errors"
import * as ut from "../../ut"
import * as Exps from "../../exps"

export class Dot extends Exp {
  target: Exp
  name: string

  constructor(target: Exp, name: string) {
    super()
    this.target = target
    this.name = name
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.target.free_names(bound_names)])
  }

  substitute(name: string, exp: Exp): Exp {
    return new Dot(this.target.substitute(name, exp), this.name)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)

    if (inferred_target.t instanceof Exps.ClsValue) {
      // NOTE `infer` need to return normalized value as core.
      // Because of `ClsValue` can be partially fulfilled by value,
      // during `infer` of `Exps.Dot`, we have opportunity to get those value back,
      // and return them as core.

      const target_value = evaluate(ctx.to_env(), inferred_target.core)
      const value = inferred_target.t.dot_value(target_value, this.name)
      const t = inferred_target.t.dot_type(target_value, this.name)

      return {
        t,
        core: readback(ctx, t, value),
      }
    }

    throw new Trace(
      ut.aline(`
        |Expecting target type to be a class.
        |  ${ut.inspect(inferred_target.t)}
        |`)
    )
  }

  repr(): string {
    return `${this.target.repr()}.${this.name}`
  }
}
