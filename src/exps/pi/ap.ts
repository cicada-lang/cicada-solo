import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { infer } from "../../infer"
import { check } from "../../check"
import { Value, match_value } from "../../value"
import { Normal } from "../../normal"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Ap extends Exp {
  target: Exp
  arg: Exp

  constructor(target: Exp, arg: Exp) {
    super()
    this.target = target
    this.arg = arg
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const target_t = infer(ctx, this.target)
    if (target_t instanceof Cores.PiValue) {
      const pi = target_t
      check(ctx, this.arg, pi.arg_t)
      const arg_value = evaluate(ctx.to_env(), this.arg)
      return pi.ret_t_cl.apply(arg_value)
    }

    const target = evaluate(ctx.to_env(), this.target)
    if (target instanceof Cores.ClsValue) {
      const cls = target
      let telescope = cls.telescope
      while (telescope.next) {
        const { name, t, value } = telescope.next
        if (value) {
          telescope = telescope.fill(value)
        } else {
          check(ctx, this.arg, t)
          const arg_value = evaluate(ctx.to_env(), this.arg)
          return new Cores.TypeValue()
        }
      }
      throw new Trace(
        ut.aline(`
          |The telescope is full.
          |`)
      )
    }

    throw new Trace(
      ut.aline(`
        |I am expecting value of type: PiValue or ClsValue.
        |`)
    )
  }

  repr(): string {
    return `${this.target.repr()}(${this.arg.repr()})`
  }
}
