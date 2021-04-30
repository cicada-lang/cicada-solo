import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { check } from "../../check"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { PiValue, FnValue } from "../../cores"
import { Var, VarNeutral } from "../../cores"
import { NotYetValue } from "../../cores"

export class Fn extends Core {
  name: string
  ret: Core

  constructor(name: string, ret: Core) {
    super()
    this.name = name
    this.ret = ret
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new FnValue(
      new Closure(ctx, env, this.name, infer(ctx, new Var(this.name)), this.ret)
    )
  }

  repr(): string {
    return `(${this.name}) => ${this.ret.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const ret_repr = this.ret.alpha_repr(ctx.extend(this.name))
    return `(${this.name}) => ${ret_repr}`
  }
}
