import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { expect } from "../../expect"
import { Value } from "../../value"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { SigmaValue, ConsValue } from "../../cores"

export class Cons extends Exp {
  car: Exp
  cdr: Exp

  constructor(car: Exp, cdr: Exp) {
    super()
    this.car = car
    this.cdr = cdr
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new ConsValue(
      evaluate(ctx, env, this.car),
      evaluate(ctx, env, this.cdr)
    )
  }

  check(ctx: Ctx, t: Value): void {
    const sigma = expect(ctx, t, SigmaValue)
    const cdr_t = sigma.cdr_t_cl.apply(evaluate(ctx, ctx.to_env(), this.car))
    check(ctx, this.car, sigma.car_t)
    check(ctx, this.cdr, cdr_t)
  }

  repr(): string {
    return `cons(${this.car.repr()}, ${this.cdr.repr()})`
  }
}
