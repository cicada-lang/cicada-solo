import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import { Closure } from "../../closure"
import * as Cores from "../../cores"

export class Sigma extends Core {
  name: string
  car_t: Core
  cdr_t: Core

  constructor(name: string, car_t: Core, cdr_t: Core) {
    super()
    this.name = name
    this.car_t = car_t
    this.cdr_t = cdr_t
  }

  evaluate(env: Env): Value {
    const car_t = evaluate(env, this.car_t)
    return new Cores.SigmaValue(car_t, new Closure(env, this.name, this.cdr_t))
  }

  repr(): string {
    return `(${this.name}: ${this.car_t.repr()} * ${this.cdr_t.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const cdr_t_repr = this.cdr_t.alpha_repr(ctx.extend(this.name))
    return `(${this.car_t.alpha_repr(ctx)} * ${cdr_t_repr})`
  }
}
