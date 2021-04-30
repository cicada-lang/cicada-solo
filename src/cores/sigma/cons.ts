import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { expect } from "../../expect"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { SigmaValue, ConsValue } from "../../cores"

export class Cons implements Core {
  car: Core
  cdr: Core

  constructor(car: Core, cdr: Core) {
    this.car = car
    this.cdr = cdr
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new ConsValue(
      evaluate(ctx, env, this.car),
      evaluate(ctx, env, this.cdr)
    )
  }

  repr(): string {
    return `cons(${this.car.repr()}, ${this.cdr.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `cons(${this.car.alpha_repr(ctx)}, ${this.cdr.alpha_repr(ctx)})`
  }
}
