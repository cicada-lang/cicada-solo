import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp, ExpMeta, infer, subst } from "../../exp"
import * as Exps from "../../exps"
import { Value, expect } from "../../value"

export class Car extends Exp {
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
    return new Car(subst(this.target, name, exp), this.meta)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const sigma = expect(ctx, inferred_target.t, Exps.SigmaValue)

    return {
      t: sigma.car_t,
      core: new Exps.CarCore(inferred_target.core),
    }
  }

  format(): string {
    return `car(${this.target.format()})`
  }
}
