import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Equal extends Exp {
  t: Exp
  from: Exp
  to: Exp

  constructor(t: Exp, from: Exp, to: Exp) {
    super()
    this.t = t
    this.from = from
    this.to = to
  }

  infer(ctx: Ctx): { t: Value; exp: Core } {
    check(ctx, this.t, new Cores.TypeValue())
    const t_value = evaluate(ctx.to_env(), this.t)
    check(ctx, this.from, t_value)
    check(ctx, this.to, t_value)
    return new Cores.TypeValue()
  }

  repr(): string {
    return `Equal(${this.t.repr()}, ${this.from.repr()}, ${this.to.repr()})`
  }
}
