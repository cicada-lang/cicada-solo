import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../closure"
import * as Exps from "../../exps"

export class FnImCore extends Core {
  name: string
  fn: Exps.FnCore

  constructor(name: string, fn: Exps.FnCore) {
    super()
    this.name = name
    this.fn = fn
  }

  evaluate(env: Env): Value {
    throw new Error("TODO")

    // return new Exps.FnValue(new Closure(env, this.name, this.ret))
  }

  multi_fn_repr(names: Array<string> = new Array()): {
    names: Array<string>
    ret: string
  } {
    const name = `given ${this.name}`
    return this.fn.multi_fn_repr([...names, name])
  }

  repr(): string {
    const { names, ret } = this.multi_fn_repr()
    return `(${names.join(", ")}) { ${ret} }`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const fn_repr = this.fn.alpha_repr(ctx.extend(this.name))
    return `(given #) { ${fn_repr} }`
  }
}
