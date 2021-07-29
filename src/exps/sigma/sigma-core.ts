import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
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

  private multi_sigma_repr(entries: Array<string> = new Array()): {
    entries: Array<string>
    cdr_t: string
  } {
    const entry = `${this.name}: ${this.car_t.repr()}`

    if (this.cdr_t instanceof SigmaCore) {
      return this.cdr_t.multi_sigma_repr([...entries, entry])
    } else {
      return {
        entries: [...entries, entry],
        cdr_t: this.cdr_t.repr(),
      }
    }
  }

  repr(): string {
    const { entries, cdr_t } = this.multi_sigma_repr()
    return `(${entries.join(", ")}) * ${cdr_t}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const cdr_t_repr = this.cdr_t.alpha_repr(ctx.extend(this.name))
    return `(${this.car_t.alpha_repr(ctx)}) * ${cdr_t_repr}`
  }
}
