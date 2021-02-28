import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { evaluate } from "../evaluate"
import { check } from "../check"
import { infer } from "../infer"
import { expect } from "../expect"
import { Value, match_value } from "../value"
import { Closure } from "../closure"
import { Normal } from "../normal"
import { Trace } from "../trace"
import { Pi, Ap } from "../core"
import { Type } from "../core"
import { Var } from "../core"
import { NotYetValue } from "../core"
import { EqualValue, SameValue } from "../core"
import { PiValue } from "../core"
import { ReplaceNeutral } from "../core"

export class Replace implements Exp {
  target: Exp
  motive: Exp
  base: Exp

  constructor(target: Exp, motive: Exp, base: Exp) {
    this.target = target
    this.motive = motive
    this.base = base
  }

  evaluate(env: Env): Value {
    return Replace.apply(
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base)
    )
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)
    const equal = expect(ctx, target_t, EqualValue)
    const motive_t = evaluate(
      new Env().extend("t", equal.t),
      new Pi("x", new Var("t"), new Type())
    )
    check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), this.motive)
    check(ctx, this.base, Ap.apply(motive_value, equal.from))
    return Ap.apply(motive_value, equal.to)
  }

  repr(): string {
    return `replace(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `replace(${this.target.alpha_repr(ctx)}, ${this.motive.alpha_repr(
      ctx
    )}, ${this.base.alpha_repr(ctx)})`
  }

  static apply(target: Value, motive: Value, base: Value): Value {
    return match_value(target, {
      SameValue: (_: SameValue) => base,
      NotYetValue: ({ t, neutral }: NotYetValue) =>
        match_value(t, {
          EqualValue: ({ t, to, from }: EqualValue) => {
            const base_t = Ap.apply(motive, from)
            const closure = new Closure(new Env(), "x", new Type())
            const motive_t = new PiValue(t, closure)
            return new NotYetValue(
              Ap.apply(motive, to),
              new ReplaceNeutral(
                neutral,
                new Normal(motive_t, motive),
                new Normal(base_t, base)
              )
            )
          },
        }),
    })
  }
}
