import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Subst } from "../../subst"
import { Closure } from "../closure"
import * as Exps from "../../exps"

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

  multi_fn_repr(names: Array<string> = new Array()): {
    names: Array<string>
    ret: string
  } {
    const name = `given ${this.name}`
    return this.ret.multi_fn_repr([...names, name])
  }

  repr(): string {
    const { names, ret } = this.multi_fn_repr()
    return `(${names.join(", ")}) { ${ret} }`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const fn_repr = this.ret.alpha_repr(ctx.extend(this.name))
    return `(given #) { ${fn_repr} }`
  }
}
