import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { infer } from "../../exp"
import { expect } from "../../value"
import { evaluate } from "../../core"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class Cdr extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.target.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new Cdr(this.target.subst(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const sigma = expect(ctx, inferred_target.t, Sem.SigmaValue)
    const target_value = evaluate(ctx.to_env(), inferred_target.core)
    const car = Sem.CarCore.apply(target_value)

    return {
      t: sigma.cdr_t_cl.apply(car),
      core: new Sem.CdrCore(inferred_target.core),
    }
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }
}
