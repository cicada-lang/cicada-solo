import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { check } from "../check"
import { evaluate } from "../evaluate"
import * as Value from "../value"

export class Sigma implements Exp {
  name: string
  car_t: Exp
  cdr_t: Exp

  constructor(name: string, car_t: Exp, cdr_t: Exp) {
    this.name = name
    this.car_t = car_t
    this.cdr_t = cdr_t
  }

  evaluate(env: Env): Value.Value {
    return Value.sigma(
      evaluate(env, this.car_t),
      Value.Closure.create(env, this.name, this.cdr_t)
    )
  }

  infer(ctx: Ctx): Value.Value {
    check(ctx, this.car_t, Value.type)
    const car_t_value = evaluate(ctx.to_env(), this.car_t)
    check(ctx.extend(this.name, car_t_value), this.cdr_t, Value.type)
    return Value.type
  }

  repr(): string {
    return `(${this.name}: ${this.car_t.repr()}) * ${this.cdr_t.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const cdr_t_repr = this.cdr_t.alpha_repr(ctx.extend(this.name))
    return `(${this.car_t.alpha_repr(ctx)}) * ${cdr_t_repr}`
  }
}
