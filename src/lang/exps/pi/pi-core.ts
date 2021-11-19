import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { evaluate } from "../../core"
import * as Exps from "../../exps"

export class PiCore extends Core {
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
    return new Exps.PiValue(
      evaluate(env, this.arg_t),
      new Closure(env, this.name, this.ret_t)
    )
  }

  pi_args_format(): Array<string> {
    const entry = `${this.name}: ${this.arg_t.format()}`
    if (has_pi_args_format(this.ret_t)) {
      return [entry, ...this.ret_t.pi_args_format()]
    } else {
      return [entry]
    }
  }

  pi_ret_t_format(): string {
    if (has_pi_ret_t_format(this.ret_t)) {
      return this.ret_t.pi_ret_t_format()
    } else {
      return this.ret_t.format()
    }
  }

  format(): string {
    const args = this.pi_args_format().join(", ")
    const ret_t = this.pi_ret_t_format()
    return `(${args}) -> ${ret_t}`
  }

  alpha_format(ctx: AlphaCtx): string {
    const arg_t_format = this.arg_t.alpha_format(ctx)
    const ret_t_format = this.ret_t.alpha_format(ctx.extend(this.name))
    return `(${arg_t_format}) -> ${ret_t_format}`
  }
}

function has_pi_args_format(
  core: Core
): core is Core & { pi_args_format(): Array<string> } {
  return (core as any).pi_args_format instanceof Function
}

function has_pi_ret_t_format(
  core: Core
): core is Core & { pi_ret_t_format(): string } {
  return (core as any).pi_ret_t_format instanceof Function
}
