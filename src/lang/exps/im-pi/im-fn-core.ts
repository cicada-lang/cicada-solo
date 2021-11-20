import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import * as Exps from "../../exps"
import { FnFormater } from "../pi/fn-formater"

export class ImFnCore extends Core {
  name: string
  ret: Exps.FnCore | Exps.ImFnCore

  constructor(name: string, ret: Exps.FnCore | Exps.ImFnCore) {
    super()
    this.name = name
    this.ret = ret
  }

  evaluate(env: Env): Value {
    return new Exps.ImFnValue(new Closure(env, this.name, this.ret))
  }

  fn_formater: FnFormater = new FnFormater(this, {
    decorate_name: (name) => `implicit ${name}`,
  })

  format(): string {
    return this.fn_formater.format()
  }

  alpha_format(ctx: AlphaCtx): string {
    const fn_format = this.ret.alpha_format(ctx.extend(this.name))
    return `(implicit ${this.name}) => { ${fn_format} }`
  }
}
