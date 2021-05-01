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

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const sigma = expect(ctx, inferred_target.t, Cores.SigmaValue)
    const target_value = evaluate(ctx.to_env(), inferred_target.core)
    const car = Cores.Car.apply(target_value)
    const t = sigma.cdr_t_cl.apply(car)
    const core = new Cores.Cdr(inferred_target.core)
    return { t, core }
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }
}
