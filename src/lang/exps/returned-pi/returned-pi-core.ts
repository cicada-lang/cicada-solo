import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { evaluate } from "../../core"
import * as Exps from ".."
import { PiFormater } from "../pi/pi-formater"
import { ReturnedInserter } from "./returned-inserter"

export class ReturnedPiCore extends Core {
  name: string
  arg_t: Core
  ret_t: Core

  constructor(name: string, arg_t: Core, ret_t: Core) {
    super()
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  evaluate(env: Env): Value {
    const arg_t = evaluate(env, this.arg_t)
    const ret_t_cl = new Closure(env, this.name, this.ret_t)

    return new Exps.ReturnedPiValue(arg_t, ret_t_cl)
  }

  pi_formater: PiFormater = new PiFormater(this, {
    decorate_binding: (binding) => `returned ${binding}`,
  })

  format(): string {
    return this.pi_formater.format()
  }

  alpha_format(ctx: AlphaCtx): string {
    const arg_t_format = this.arg_t.alpha_format(ctx)
    const pi_format = this.ret_t.alpha_format(ctx.extend(this.name))
    return `(returned ${arg_t_format}) -> ${pi_format}`
  }
}
