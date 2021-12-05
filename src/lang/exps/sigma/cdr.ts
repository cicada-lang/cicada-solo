import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Exp, ExpMeta, infer, subst } from "../../exp"
import * as Exps from "../../exps"
import { expect, Value } from "../../value"

export class Cdr extends Exp {
  meta: ExpMeta
  target: Exp

  constructor(target: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.target = target
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.target.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new Cdr(subst(this.target, name, exp), this.meta)
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

  format(): string {
    return `cdr(${this.target.format()})`
  }
}
