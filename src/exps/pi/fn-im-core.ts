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
    throw new Error("TODO")

    // if (this.ret instanceof FnImCore) {
    //   return this.ret.multi_fn_repr([...names, this.name])
    // } else {
    //   return { names: [...names, this.name], ret: this.ret.repr() }
    // }
  }

  repr(): string {
    throw new Error("TODO")

    // const { names, ret } = this.multi_fn_repr()
    // return `(${names.join(", ")}) { ${ret} }`
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error("TODO")

    // const ret_repr = this.ret.alpha_repr(ctx.extend(this.name))
    // return `# { ${ret_repr} }`
  }
}
