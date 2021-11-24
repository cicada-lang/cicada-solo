import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import * as Exps from ".."
import { FnFormater } from "../pi/fn-formater"

export class ReturnedFnCore extends Core {
  name: string
  ret: Core

  constructor(name: string, ret: Core) {
    super()
    this.name = name
    this.ret = ret
  }

  evaluate(env: Env): Value {
    return new Exps.ReturnedFnValue(new Closure(env, this.name, this.ret))
  }

  fn_formater: FnFormater = new FnFormater(this, {
    decorate_name: (name) => `returned ${name}`,
  })

  format(): string {
    return this.fn_formater.format()
  }

  alpha_format(ctx: AlphaCtx): string {
    const fn_format = this.ret.alpha_format(ctx.extend(this.name))
    return `(returned ${this.name}) => { ${fn_format} }`
  }
}
