import { Exp, AlphaCtx } from "@/exp"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { expect } from "@/expect"
import { Value } from "@/value"
import { Closure } from "@/closure"
import { evaluate } from "@/evaluate"
import { check } from "@/check"
import { SigmaValue, ConsValue } from "@/core"

export class Cons implements Exp {
  car: Exp
  cdr: Exp

  constructor(car: Exp, cdr: Exp) {
    this.car = car
    this.cdr = cdr
  }

  evaluate(env: Env): Value {
    return new ConsValue(evaluate(env, this.car), evaluate(env, this.cdr))
  }

  check(ctx: Ctx, t: Value): void {
    const sigma = expect(ctx, t, SigmaValue)
    const cdr_t = sigma.cdr_t_cl.apply(evaluate(ctx.to_env(), this.car))
    check(ctx, this.car, sigma.car_t)
    check(ctx, this.cdr, cdr_t)
  }

  repr(): string {
    return `@cons ${this.car.repr()} ${this.cdr.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `@cons ${this.car.alpha_repr(ctx)} ${this.cdr.alpha_repr(ctx)}`
  }
}
