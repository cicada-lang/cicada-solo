import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { Closure } from "../closure"
import { FnFormater } from "./fn-formater"

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

  fn_formater = new FnFormater(this)

  format(): string {
    return this.fn_formater.format()
  }

  alpha_format(ctx: AlphaCtx): string {
    const ret_format = this.ret.alpha_format(ctx.extend(this.name))
    return `(#) => { ${ret_format} }`
  }
}
