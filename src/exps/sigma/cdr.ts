import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { evaluate } from "../../evaluate"
import { Value, match_value } from "../../value"
import * as Exps from "../../exps"
import * as Cores from "../../cores"

export class Cdr extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  infer(ctx: Ctx): { t: Value; exp: Core } {
    const target_t = infer(ctx, this.target)
    const sigma = expect(ctx, target_t, Cores.SigmaValue)
    const car = Cores.Car.apply(evaluate(ctx.to_env(), this.target))
    return sigma.cdr_t_cl.apply(car)
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }
}
