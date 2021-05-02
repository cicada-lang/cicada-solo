import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value, match_value } from "../../value"
import { evaluate } from "../../evaluate"
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
      const t = inferred_target.t.dot(
        evaluate(ctx.to_env(), inferred_target.core),
        this.name
      )
      const core = new Cores.Dot(inferred_target.core, this.name)
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
