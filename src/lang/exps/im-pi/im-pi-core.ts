import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { evaluate } from "../../core"
import * as Exps from "../../exps"

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

  im_pi_args_format(): Array<string> {
    if (this.ret_t instanceof Exps.PiCore) {
      return [`${this.field_name}: ${this.arg_t.format()}`]
    } else {
      return [
        `${this.field_name}: ${this.arg_t.format()}`,
        ...this.ret_t.im_pi_args_format(),
      ]
    }
  }

  pi_args_format(): Array<string> {
    if (this.ret_t instanceof Exps.PiCore) {
      const entry = `implicit { ${this.im_pi_args_format().join(", ")} }`
      return [entry, ...this.ret_t.pi_args_format()]
    } else {
      const entry = `implicit { ${this.im_pi_args_format().join(", ")} }`
      // NOTE replace the head of the `entries`.
      return [entry, ...this.ret_t.pi_args_format().slice(1)]
    }
  }

  pi_ret_t_format(): string {
    return this.ret_t.pi_ret_t_format()
  }

  format(): string {
    const args = this.pi_args_format().join(", ")
    const ret_t = this.pi_ret_t_format()
    return `(${args}) -> ${ret_t}`
  }

  alpha_format(ctx: AlphaCtx): string {
    const arg_t_format = this.arg_t.alpha_format(ctx)
    const pi_format = this.ret_t.alpha_format(ctx.extend(this.local_name))
    return `(implicit ${arg_t_format}) -> ${pi_format}`
  }
}
