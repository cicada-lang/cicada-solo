import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { expect } from "../../value"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import { check } from "../../exp"
import * as Exps from "../../exps"

export class Cons extends Exp {
  meta: ExpMeta
  car: Exp
  cdr: Exp

  constructor(car: Exp, cdr: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.car = car
    this.cdr = cdr
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.car.free_names(bound_names),
      ...this.cdr.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Cons(
      subst(this.car, name, exp),
      subst(this.cdr, name, exp),
      this.meta
    )
  }

  check(ctx: Ctx, t: Value): Core {
    const sigma = expect(ctx, t, Exps.SigmaValue)
    const car_core = check(ctx, this.car, sigma.car_t)
    const cdr_t_value = sigma.cdr_t_cl.apply(evaluate(ctx.to_env(), car_core))
    const cdr_core = check(ctx, this.cdr, cdr_t_value)
    return new Exps.ConsCore(car_core, cdr_core)
  }

  format(): string {
    return `[${this.car.format()} | ${this.cdr.format()}]`
  }
}
