import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import { Closure } from "../../closure"
import * as Cores from "../../cores"

export class Sigma extends Exp {
  name: string
  car_t: Exp
  cdr_t: Exp

  constructor(name: string, car_t: Exp, cdr_t: Exp) {
    super()
    this.name = name
    this.car_t = car_t
    this.cdr_t = cdr_t
  }

  evaluate(ctx: Ctx, env: Env): Value {
    const car_t = evaluate(ctx, env, this.car_t)
    return new Cores.SigmaValue(
      car_t,
      new Closure(ctx, env, this.name, car_t, this.cdr_t)
    )
  }

  infer(ctx: Ctx): Value {
    check(ctx, this.car_t, new Cores.TypeValue())
    const car_t_value = evaluate(ctx, ctx.to_env(), this.car_t)
    check(ctx.extend(this.name, car_t_value), this.cdr_t, new Cores.TypeValue())
    return new Cores.TypeValue()
  }

  repr(): string {
    return `(${this.name}: ${this.car_t.repr()} * ${this.cdr_t.repr()})`
  }
}
