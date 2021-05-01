import { Exp } from "../../exp"
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

  evaluate(ctx: Ctx, env: Env): Value {
    return Ap.apply(
      evaluate(ctx, env, this.target),
      evaluate(ctx, env, this.arg)
    )
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)
    if (target_t instanceof Cores.PiValue) {
      const pi = target_t
      check(ctx, this.arg, pi.arg_t)
      const arg_value = evaluate(ctx, ctx.to_env(), this.arg)
      return pi.ret_t_cl.apply(arg_value)
    }

    const target = evaluate(ctx, ctx.to_env(), this.target)
    if (target instanceof Cores.ClsValue) {
      const cls = target
      let telescope = cls.telescope
      while (telescope.next) {
        const { name, t, value } = telescope.next
        if (value) {
          telescope = telescope.fill(value)
        } else {
          check(ctx, this.arg, t)
          const arg_value = evaluate(ctx, ctx.to_env(), this.arg)
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

  static apply(target: Value, arg: Value): Value {
    return match_value(target, [
      [Cores.FnValue, (fn: Cores.FnValue) => fn.ret_cl.apply(arg)],
      [Cores.ClsValue, (cls: Cores.ClsValue) => cls.apply(arg)],
      [Cores.ExtValue, (ext: Cores.ExtValue) => ext.apply(arg)],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          match_value(t, [
            [
              Cores.PiValue,
              (pi: Cores.PiValue) =>
                new Cores.NotYetValue(
                  pi.ret_t_cl.apply(arg),
                  new Cores.ApNeutral(neutral, new Normal(pi.arg_t, arg))
                ),
            ],
          ]),
      ],
    ])
  }
}
