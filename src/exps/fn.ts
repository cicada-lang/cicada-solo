import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import * as Value from "../value"
import * as Neutral from "../neutral"
import { check } from "../check"

export class Fn implements Exp {
  kind = "Fn"
  name: string
  ret: Exp

  constructor(name: string, ret: Exp) {
    this.name = name
    this.ret = ret
  }

  evaluability(env: Env): Value.Value {
    return Value.fn(Value.Closure.create(env, this.name, this.ret))
  }

  checkability(ctx: Ctx, t: Value.Value): void {
    const pi = Value.is_pi(ctx, t)
    const arg = Value.not_yet(pi.arg_t, Neutral.v(this.name))
    const ret_t = Value.Closure.apply(pi.ret_t_cl, arg)
    check(ctx.extend(this.name, pi.arg_t), this.ret, ret_t)
  }

  repr(): string {
    return `(${this.name}) => ${this.ret.repr()}`
  }

  alpha_repr(opts: AlphaReprOpts): string {
    const ret_repr = this.ret.alpha_repr({
      depth: opts.depth + 1,
      depths: new Map([...opts.depths, [this.name, opts.depth]]),
    })
    return `(${this.name}) => ${ret_repr}`
  }
}
