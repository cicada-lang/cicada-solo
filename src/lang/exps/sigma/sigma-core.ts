import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import * as Exps from "../../exps"

export class SigmaCore extends Core {
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
    return new Exps.SigmaValue(car_t, new Closure(env, this.name, this.cdr_t))
  }

  sigma_cars_repr(): Array<string> {
    const entry = `${this.name}: ${this.car_t.repr()}`

    if (has_sigma_cars_repr(this.cdr_t)) {
      return [entry, ...this.cdr_t.sigma_cars_repr()]
    } else {
      return [entry]
    }
  }

  sigma_cdr_t_repr(): string {
    if (has_sigma_cdr_t_repr(this.cdr_t)) {
      return this.cdr_t.sigma_cdr_t_repr()
    } else {
      return this.cdr_t.repr()
    }
  }

  repr(): string {
    const cars = this.sigma_cars_repr().join(", ")
    const cdr_t = this.sigma_cdr_t_repr()
    return `[${cars} | ${cdr_t}]`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const cdr_t_repr = this.cdr_t.alpha_repr(ctx.extend(this.name))
    return `[${this.car_t.alpha_repr(ctx)} | ${cdr_t_repr}]`
  }
}

function has_sigma_cars_repr(
  core: Core
): core is Core & { sigma_cars_repr(): Array<string> } {
  return (core as any).sigma_cars_repr instanceof Function
}

function has_sigma_cdr_t_repr(
  core: Core
): core is Core & { sigma_cdr_t_repr(): string } {
  return (core as any).sigma_cdr_t_repr instanceof Function
}
