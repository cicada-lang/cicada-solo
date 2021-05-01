import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { TypeValue } from "../../cores"
import { PiValue } from "../../cores"

export class Pi extends Exp {
  name: string
  arg_t: Exp
  ret_t: Exp

  constructor(name: string, arg_t: Exp, ret_t: Exp) {
    super()
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  evaluate(ctx: Ctx, env: Env): Value {
    const arg_t = evaluate(ctx, env, this.arg_t)
    return new PiValue(
      arg_t,
      new Closure(ctx, env, this.name, arg_t, this.ret_t)
    )
  }

  infer(ctx: Ctx): Value {
    check(ctx, this.arg_t, new TypeValue())
    const arg_t_value = evaluate(ctx, ctx.to_env(), this.arg_t)
    check(ctx.extend(this.name, arg_t_value), this.ret_t, new TypeValue())
    return new TypeValue()
  }

  repr(): string {
    return `(${this.name}: ${this.arg_t.repr()}) -> ${this.ret_t.repr()}`
  }
}
