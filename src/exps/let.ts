import { Exp } from "../exp"
import { Core } from "../core"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { evaluate } from "../evaluate"
import { infer } from "../infer"
import { check } from "../check"
import * as Cores from "../cores"

export class Let extends Exp {
  name: string
  exp: Exp
  ret: Exp

  constructor(name: string, exp: Exp, ret: Exp) {
    super()
    this.name = name
    this.exp = exp
    this.ret = ret
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred = infer(ctx, this.exp)
    const value = evaluate(ctx.to_env(), inferred.core)
    const inferred_ret = infer(
      ctx.extend(this.name, inferred.t, value),
      this.ret
    )
    const core = new Cores.Let(this.name, inferred.core, inferred_ret.core)
    return { t: inferred_ret.t, core }
  }

  check(ctx: Ctx, t: Value): Core {
    const inferred = infer(ctx, this.exp)
    const value = evaluate(ctx.to_env(), inferred.core)
    const ret_core = check(
      ctx.extend(this.name, inferred.t, value),
      this.ret,
      t
    )
    return new Cores.Let(this.name, inferred.core, ret_core)
  }

  repr(): string {
    return `@let ${this.name} = ${this.exp.repr()} ${this.ret.repr()}`
  }
}
