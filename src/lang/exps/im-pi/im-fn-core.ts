import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import * as Exps from "../../exps"
import { FnFormater } from "../pi/fn-formater"

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

  get name(): string {
    return this.local_name
  }

  evaluate(env: Env): Value {
    return new Exps.ImFnValue(
      this.field_name,
      new Closure(env, this.local_name, this.ret)
    )
  }

  fn_formater: FnFormater = new FnFormater(this, {
    decorate_name: (name) => `implicit ${name}`,
  })

  format(): string {
    return this.fn_formater.format()
  }

  alpha_format(ctx: AlphaCtx): string {
    const fn_format = this.ret.alpha_format(ctx.extend(this.local_name))
    return `(implicit ${this.field_name}) => { ${fn_format} }`
  }
}
