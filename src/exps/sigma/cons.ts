import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { expect } from "../../expect"
import { Value } from "../../value"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import * as Cores from "../../cores"

export class Cons extends Exp {
  car: Exp
  cdr: Exp

  constructor(car: Exp, cdr: Exp) {
    super()
    this.car = car
    this.cdr = cdr
  }

  subst(name: string, exp: Exp): Exp {
    return new Cons(this.car.subst(name, exp), this.cdr.subst(name, exp))
  }

  check(ctx: Ctx, t: Value): Core {
    const sigma = expect(ctx, t, Cores.SigmaValue)
    const car_core = check(ctx, this.car, sigma.car_t)
    const cdr_t_value = sigma.cdr_t_cl.apply(evaluate(ctx.to_env(), car_core))
    const cdr_core = check(ctx, this.cdr, cdr_t_value)
    return new Cores.Cons(car_core, cdr_core)
  }

  repr(): string {
    return `cons(${this.car.repr()}, ${this.cdr.repr()})`
  }
}
