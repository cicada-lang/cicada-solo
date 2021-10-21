import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import * as Exps from "../../exps"

export class ImFnCore extends Core {
  field_name: string
  local_name: string
  ret: Exps.FnCore | Exps.ImFnCore

  constructor(
    field_name: string,
    local_name: string,
    ret: Exps.FnCore | Exps.ImFnCore
  ) {
    super()
    this.field_name = field_name
    this.local_name = local_name
    this.ret = ret
  }

  evaluate(env: Env): Value {
    return new Exps.ImFnValue(
      this.field_name,
      new Closure(env, this.local_name, this.ret)
    )
  }

  im_fn_args_repr(): Array<string> {
    if (this.ret instanceof Exps.ImFnCore) {
      return [this.field_name, ...this.ret.im_fn_args_repr()]
    } else {
      return [this.field_name]
    }
  }

  fn_args_repr(): Array<string> {
    const entries = this.im_fn_args_repr().join(", ")
    if (this.ret instanceof Exps.ImFnCore) {
      return [`implicit { ${entries} }`, ...this.ret.fn_args_repr().slice(1)]
    } else {
      return [`implicit { ${entries} }`, ...this.ret.fn_args_repr()]
    }
  }

  fn_ret_repr(): string {
    return this.ret.fn_ret_repr()
  }

  repr(): string {
    const args = this.fn_args_repr().join(", ")
    const ret = this.fn_ret_repr()
    return `(${args}) => { ${ret} }`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const fn_repr = this.ret.alpha_repr(ctx.extend(this.local_name))
    return `(implicit ${this.field_name}) => { ${fn_repr} }`
  }
}
