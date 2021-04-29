import { Exp } from "../exp"
import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"
import { evaluate } from "../evaluate"

export class Closure {
  ctx: Ctx
  env: Env
  name: string
  arg_t: Value
  ret: Exp

  constructor(ctx: Ctx, env: Env, name: string, arg_t: Value, ret: Exp) {
    this.ctx = ctx
    this.env = env
    this.name = name
    this.arg_t = arg_t
    this.ret = ret
  }

  apply(value: Value): Value {
    return evaluate(
      this.ctx.extend(this.name, this.arg_t, value),
      this.env.extend(this.name, this.arg_t, value),
      this.ret
    )
  }
}
