import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Car extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Car(this.target.subst(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const sigma = expect(ctx, inferred_target.t, Cores.SigmaValue)

    return {
      t: sigma.car_t,
      core: new Cores.Car(inferred_target.core),
    }
  }

  repr(): string {
    return `car(${this.target.repr()})`
  }
}
