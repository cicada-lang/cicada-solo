import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import * as Exps from "../../exps"

export class FnCore extends Core {
  name: string
  ret: Core

  constructor(name: string, ret: Core) {
    super()
    this.name = name
    this.ret = ret
  }

  evaluate(env: Env): Value {
    return new Exps.FnValue(new Closure(env, this.name, this.ret))
  }

  format(): string {
    const args = this.fn_args_format().join(", ")
    const ret = this.fn_ret_format()
    return `(${args}) => { ${ret} }`
  }

  fn_args_format(): Array<string> {
    if (has_fn_args_format(this.ret)) {
      return [this.name, ...this.ret.fn_args_format()]
    } else {
      return [this.name]
    }
  }

  fn_ret_format(): string {
    if (has_fn_ret_format(this.ret)) {
      return this.ret.fn_ret_format()
    } else {
      return this.ret.format()
    }
  }

  alpha_format(ctx: AlphaCtx): string {
    const ret_format = this.ret.alpha_format(ctx.extend(this.name))
    return `(#) => { ${ret_format} }`
  }
}

function has_fn_args_format(
  core: Core
): core is Core & { fn_args_format(): Array<string> } {
  return (core as any).fn_args_format instanceof Function
}

function has_fn_ret_format(
  core: Core
): core is Core & { fn_ret_format(): string } {
  return (core as any).fn_ret_format instanceof Function
}
