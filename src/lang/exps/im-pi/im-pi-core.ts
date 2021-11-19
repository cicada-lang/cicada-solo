import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { evaluate } from "../../core"
import * as Exps from "../../exps"
import { PiFormater } from "../pi/pi-formater"

export class ImPiCore extends Core {
  field_name: string
  local_name: string
  arg_t: Core
  ret_t: Exps.PiCore | Exps.ImPiCore

  constructor(
    field_name: string,
    local_name: string,
    arg_t: Core,
    ret_t: Exps.PiCore | Exps.ImPiCore
  ) {
    super()
    this.field_name = field_name
    this.local_name = local_name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  get name(): string {
    return this.field_name
  }

  evaluate(env: Env): Value {
    if (this.ret_t instanceof Exps.PiCore) {
      return new Exps.BaseImPiValue(
        this.field_name,
        evaluate(env, this.arg_t),
        new Closure(env, this.local_name, this.ret_t)
      )
    } else {
      return new Exps.ConsImPiValue(
        this.field_name,
        evaluate(env, this.arg_t),
        new Closure(env, this.local_name, this.ret_t)
      )
    }
  }

  pi_formater: PiFormater = new PiFormater(this, {
    decorate_binding: (binding) => `implicit ${binding}`
  })

  format(): string {
    return this.pi_formater.format()

    // const args = this.format_args().join(", ")
    // const ret_t = this.ret_t.pi_formater.format_ret_t()
    // return `(${args}) -> ${ret_t}`
  }

  format_args(): Array<string> {
    const entry = `implicit { ${this.format_im_args().join(", ")} }`
    if (this.ret_t instanceof Exps.PiCore) {
      return [entry, ...this.ret_t.pi_formater.format_args()]
    } else {
      // NOTE replace the head of the `entries`.
      return [entry, ...this.ret_t.format_args().slice(1)]
    }
  }

  format_im_args(): Array<string> {
    const entry = `${this.field_name}: ${this.arg_t.format()}`
    if (this.ret_t instanceof Exps.PiCore) {
      return [entry]
    } else {
      return [entry, ...this.ret_t.format_im_args()]
    }
  }

  alpha_format(ctx: AlphaCtx): string {
    const arg_t_format = this.arg_t.alpha_format(ctx)
    const pi_format = this.ret_t.alpha_format(ctx.extend(this.local_name))
    return `(implicit ${arg_t_format}) -> ${pi_format}`
  }
}
