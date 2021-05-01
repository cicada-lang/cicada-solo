import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
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

  check(ctx: Ctx, t: Value): Core {
    const sigma = expect(ctx, t, Cores.SigmaValue)
    const cdr_t = sigma.cdr_t_cl.apply(evaluate(ctx.to_env(), this.car))
    check(ctx, this.car, sigma.car_t)
    check(ctx, this.cdr, cdr_t)
  }

  repr(): string {
    return `cons(${this.car.repr()}, ${this.cdr.repr()})`
  }
}
