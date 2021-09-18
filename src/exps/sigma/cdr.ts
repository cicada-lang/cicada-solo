import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { infer } from "../../exp"
import { expect } from "../../value"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class Cdr extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.target.free_names(bound_names)])
  }

  substitute(name: string, exp: Exp): Exp {
    return new Cdr(this.target.substitute(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const sigma = expect(ctx, inferred_target.t, Exps.SigmaValue)
    const target_value = evaluate(ctx.to_env(), inferred_target.core)
    const car = Exps.CarCore.apply(target_value)

    return {
      t: sigma.cdr_t_cl.apply(car),
      core: new Exps.CdrCore(inferred_target.core),
    }
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }
}
