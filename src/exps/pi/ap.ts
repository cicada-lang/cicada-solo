import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { infer } from "../../infer"
import { check } from "../../check"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { expect } from "../../expect"
import { Normal } from "../../normal"
import { NotYetValue } from "../../exps"
import { FnValue, PiValue, ApNeutral } from "../../exps"
import { ClsValue, ExtValue, TypeValue } from "../../exps"
import { Trace } from "../../trace"
import * as ut from "../../ut"

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
    if (target_t instanceof PiValue) {
      const pi = target_t
      check(ctx, this.arg, pi.arg_t)
      const arg_value = evaluate(ctx, ctx.to_env(), this.arg)
      return pi.ret_t_cl.apply(arg_value)
    }

    const target = evaluate(ctx, ctx.to_env(), this.target)
    if (target instanceof ClsValue) {
      const cls = target
      let telescope = cls.telescope
      while (telescope.next) {
        const { name, t, value } = telescope.next
        if (value) {
          telescope = telescope.fill(value)
        } else {
          check(ctx, this.arg, t)
          const arg_value = evaluate(ctx, ctx.to_env(), this.arg)
          return new TypeValue()
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

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}(${this.arg.alpha_repr(ctx)})`
  }

  static apply(target: Value, arg: Value): Value {
    return match_value(target, [
      [FnValue, (fn: FnValue) => fn.ret_cl.apply(arg)],
      [ClsValue, (cls: ClsValue) => cls.apply(arg)],
      [ExtValue, (ext: ExtValue) => ext.apply(arg)],
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              PiValue,
              (pi: PiValue) =>
                new NotYetValue(
                  pi.ret_t_cl.apply(arg),
                  new ApNeutral(neutral, new Normal(pi.arg_t, arg))
                ),
            ],
          ]),
      ],
    ])
  }
}
