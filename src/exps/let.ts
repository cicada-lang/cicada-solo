import { Exp } from "../exp"
import { Core } from "../core"
import { Value } from "../value"
import { Env } from "../env"
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
    return infer(
      ctx.extend(
        this.name,
        infer(ctx, this.exp),
        evaluate(ctx.to_env(), this.exp)
      ),
      this.ret
    )
  }

  check(ctx: Ctx, t: Value): Core {
    check(
      ctx.extend(
        this.name,
        infer(ctx, this.exp),
        evaluate(ctx.to_env(), this.exp)
      ),
      this.ret,
      t
    )
  }

  repr(): string {
    return `@let ${this.name} = ${this.exp.repr()} ${this.ret.repr()}`
  }
}
