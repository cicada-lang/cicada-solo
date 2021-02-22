import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import * as Value from "../value"

import { check } from "../check"
import { evaluate } from "../evaluate"

export class Pi implements Exp {
  kind = "Pi"
  name: string
  arg_t: Exp
  ret_t: Exp

  constructor(name: string, arg_t: Exp, ret_t: Exp) {
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  evaluate(env: Env): Value.Value {
    return Value.pi(
      evaluate(env, this.arg_t),
      Value.Closure.create(env, this.name, this.ret_t)
    )
  }

  infer(ctx: Ctx): Value.Value {
    check(ctx, this.arg_t, Value.type)
    const arg_t_value = evaluate(ctx.to_env(), this.arg_t)
    check(ctx.extend(this.name, arg_t_value), this.ret_t, Value.type)
    return Value.type
  }

  repr(): string {
    return `(${this.name}: ${this.arg_t.repr()}) -> ${this.ret_t.repr()}`
  }

  alpha_repr(opts: AlphaReprOpts): string {
    const arg_t_repr = this.arg_t.alpha_repr(opts)
    const ret_t_repr = this.ret_t.alpha_repr({
      depth: opts.depth + 1,
      depths: new Map([...opts.depths, [this.name, opts.depth]]),
    })
    return `(${arg_t_repr}) -> ${ret_t_repr}`
  }
}
