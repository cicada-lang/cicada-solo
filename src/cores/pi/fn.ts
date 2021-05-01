import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { infer } from "../../infer"
import * as Cores from "../../cores"

export class Fn extends Core {
  name: string
  ret: Core

  constructor(name: string, ret: Core) {
    super()
    this.name = name
    this.ret = ret
  }

  evaluate(ctx: Ctx, env: Env): Value {
    const t = infer(ctx, new Cores.Var(this.name))
    return new Cores.FnValue(new Closure(ctx, env, this.name, t, this.ret))
  }

  repr(): string {
    return `(${this.name}) => ${this.ret.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const ret_repr = this.ret.alpha_repr(ctx.extend(this.name))
    return `(${this.name}) => ${ret_repr}`
  }
}
