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

  im_fn_args_format(): Array<string> {
    if (this.ret instanceof Exps.ImFnCore) {
      return [this.field_name, ...this.ret.im_fn_args_format()]
    } else {
      return [this.field_name]
    }
  }

  fn_args_format(): Array<string> {
    const entries = this.im_fn_args_format().join(", ")
    if (this.ret instanceof Exps.ImFnCore) {
      return [`implicit { ${entries} }`, ...this.ret.fn_args_format().slice(1)]
    } else {
      return [`implicit { ${entries} }`, ...this.ret.fn_args_format()]
    }
  }

  fn_ret_format(): string {
    return this.ret.fn_ret_format()
  }

  format(): string {
    const args = this.fn_args_format().join(", ")
    const ret = this.fn_ret_format()
    return `(${args}) => { ${ret} }`
  }

  alpha_format(ctx: AlphaCtx): string {
    const fn_format = this.ret.alpha_format(ctx.extend(this.local_name))
    return `(implicit ${this.field_name}) => { ${fn_format} }`
  }
}
