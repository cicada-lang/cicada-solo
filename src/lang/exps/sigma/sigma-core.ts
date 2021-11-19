import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import * as Exps from "../../exps"
import { SigmaFormater } from "./sigma-formater"

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

  sigma_formater = new SigmaFormater(this)

  format(): string {
    return this.sigma_formater.format()
  }

  alpha_format(ctx: AlphaCtx): string {
    const cdr_t_format = this.cdr_t.alpha_format(ctx.extend(this.name))
    return `[${this.car_t.alpha_format(ctx)} | ${cdr_t_format}]`
  }
}
