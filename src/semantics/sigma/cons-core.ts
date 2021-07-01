import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../core"
import * as Sem from "../../sem"

export class Cons extends Core {
  car: Core
  cdr: Core

  constructor(car: Core, cdr: Core) {
    super()
    this.car = car
    this.cdr = cdr
  }

  evaluate(env: Env): Value {
    return new Sem.ConsValue(evaluate(env, this.car), evaluate(env, this.cdr))
  }

  repr(): string {
    return `cons(${this.car.repr()}, ${this.cdr.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `cons(${this.car.alpha_repr(ctx)}, ${this.cdr.alpha_repr(ctx)})`
  }
}
