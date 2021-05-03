import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value, match_value } from "../../value"
import { evaluate } from "../../evaluate"
import { readback } from "../../readback"
import { infer } from "../../infer"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Dot extends Exp {
  target: Exp
  name: string

  constructor(target: Exp, name: string) {
    super()
    this.target = target
    this.name = name
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)

    if (
      inferred_target.t instanceof Cores.ClsValue ||
      inferred_target.t instanceof Cores.ExtValue
    ) {
      // NOTE `infer` need to return normalized value as core.
      // Because of `ClsValue` and `ExtValue` can be partially fulfilled by value,
      // during `infer` of `Exps.Dot`, we have opportunity to get those value back,
      // and return them as core.

      const t = inferred_target.t.dot_type(
        evaluate(ctx.to_env(), inferred_target.core),
        this.name
      )

      const value = inferred_target.t.dot_value(
        evaluate(ctx.to_env(), inferred_target.core),
        this.name
      )

      const core = readback(ctx, t, value)

      return { t, core }
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
