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

  fn_args_repr(): Array<string> {
    if (has_fn_args_repr(this.ret)) {
      return [this.name, ...this.ret.fn_args_repr()]
    } else {
      return [this.name]
    }
  }

  fn_ret_repr(): string {
    if (has_fn_ret_repr(this.ret)) {
      return this.ret.fn_ret_repr()
    } else {
      return this.ret.repr()
    }
  }

  repr(): string {
    const args = this.fn_args_repr().join(", ")
    const ret = this.fn_ret_repr()
    return `(${args}) => { ${ret} }`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const ret_repr = this.ret.alpha_repr(ctx.extend(this.name))
    return `(#) => { ${ret_repr} }`
  }
}

function has_fn_args_repr(
  core: Core
): core is Core & { fn_args_repr(): Array<string> } {
  return (core as any).fn_args_repr instanceof Function
}

function has_fn_ret_repr(core: Core): core is Core & { fn_ret_repr(): string } {
  return (core as any).fn_ret_repr instanceof Function
}
