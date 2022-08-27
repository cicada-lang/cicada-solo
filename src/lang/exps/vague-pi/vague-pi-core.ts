import * as Exps from ".."
import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../closure"
import { PiFormater } from "../pi/pi-formater"

export class VaguePiCore extends Core {
  name: string
  arg_t: Core
  ret_t: Core

  constructor(name: string, arg_t: Core, ret_t: Core) {
    super()
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.arg_t.free_names(bound_names),
      ...this.ret_t.free_names(new Set([...bound_names, this.name])),
    ])
  }

  evaluate(env: Env): Value {
    const arg_t = evaluate(env, this.arg_t)
    const ret_t_cl = new Closure(env, this.name, this.ret_t)

    return new Exps.VaguePiValue(arg_t, ret_t_cl)
  }

  pi_formater: PiFormater = new PiFormater(this, {
    decorate_typing: (typing) => `vague ${typing}`,
  })

  format(): string {
    return this.pi_formater.format()
  }

  alpha_format(ctx: AlphaCtx): string {
    const arg_t_format = this.arg_t.alpha_format(ctx)
    const pi_format = this.ret_t.alpha_format(ctx.extend(this.name))
    return `(vague ${arg_t_format}) -> ${pi_format}`
  }
}
