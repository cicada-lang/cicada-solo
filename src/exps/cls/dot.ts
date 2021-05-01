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

  infer(ctx: Ctx): { t: Value; exp: Core } {
    const target_t = infer(ctx, this.target)

    if (
      target_t instanceof Cores.ClsValue ||
      target_t instanceof Cores.ExtValue
    ) {
      return target_t.dot(evaluate(ctx.to_env(), this.target), this.name)
    }

    throw new Trace(
      ut.aline(`
        |Expecting target type to be a class.
        |  ${ut.inspect(target_t)}
        |`)
    )
  }

  repr(): string {
    return `${this.target.repr()}.${this.name}`
  }
}
