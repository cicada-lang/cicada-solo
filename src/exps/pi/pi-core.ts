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

  pi_args_repr(): Array<string> {
    const entry = `${this.name}: ${this.arg_t.repr()}`
    if (has_pi_args_repr(this.ret_t)) {
      return [entry, ...this.ret_t.pi_args_repr()]
    } else {
      return [entry]
    }
  }

  pi_ret_t_repr(): string {
    if (has_pi_ret_t_repr(this.ret_t)) {
      return this.ret_t.pi_ret_t_repr()
    } else {
      return this.ret_t.repr()
    }
  }

  repr(): string {
    const args = this.pi_args_repr().join(", ")
    const ret_t = this.pi_ret_t_repr()
    return `(${args}) -> ${ret_t}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const arg_t_repr = this.arg_t.alpha_repr(ctx)
    const ret_t_repr = this.ret_t.alpha_repr(ctx.extend(this.name))
    return `(${arg_t_repr}) -> ${ret_t_repr}`
  }
}

function has_pi_args_repr(
  core: Core
): core is Core & { pi_args_repr(): Array<string> } {
  return (core as any).pi_args_repr instanceof Function
}

function has_pi_ret_t_repr(
  core: Core
): core is Core & { pi_ret_t_repr(): string } {
  return (core as any).pi_ret_t_repr instanceof Function
}
