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

  sigma_cars_format(): Array<string> {
    const entry = `${this.name}: ${this.car_t.format()}`

    if (has_sigma_cars_format(this.cdr_t)) {
      return [entry, ...this.cdr_t.sigma_cars_format()]
    } else {
      return [entry]
    }
  }

  sigma_cdr_t_format(): string {
    if (has_sigma_cdr_t_format(this.cdr_t)) {
      return this.cdr_t.sigma_cdr_t_format()
    } else {
      return this.cdr_t.format()
    }
  }

  format(): string {
    const cars = this.sigma_cars_format().join(", ")
    const cdr_t = this.sigma_cdr_t_format()
    return `[${cars} | ${cdr_t}]`
  }

  alpha_format(ctx: AlphaCtx): string {
    const cdr_t_format = this.cdr_t.alpha_format(ctx.extend(this.name))
    return `[${this.car_t.alpha_format(ctx)} | ${cdr_t_format}]`
  }
}

function has_sigma_cars_format(
  core: Core
): core is Core & { sigma_cars_format(): Array<string> } {
  return (core as any).sigma_cars_format instanceof Function
}

function has_sigma_cdr_t_format(
  core: Core
): core is Core & { sigma_cdr_t_format(): string } {
  return (core as any).sigma_cdr_t_format instanceof Function
}
