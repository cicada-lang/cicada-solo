import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import { Pi, Ap } from "../../cores"
import { Type, TypeValue } from "../../cores"
import { Var } from "../../cores"
import { NotYetValue } from "../../cores"
import { EqualValue, SameValue } from "../../cores"
import { PiValue } from "../../cores"
import { ReplaceNeutral } from "../../cores"

export class Replace implements Core {
  target: Core
  motive: Core
  base: Core

  constructor(target: Core, motive: Core, base: Core) {
    this.target = target
    this.motive = motive
    this.base = base
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return Replace.apply(
      evaluate(ctx, env, this.target),
      evaluate(ctx, env, this.motive),
      evaluate(ctx, env, this.base)
    )
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
    return match_value(target, [
      [SameValue, (_: SameValue) => base],
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              EqualValue,
              ({ t, to, from }: EqualValue) => {
                const base_t = Ap.apply(motive, from)
                const motive_t = new PiValue(
                  t,
                  new Closure(new Ctx(), new Env(), "x", t, new Type())
                )
                return new NotYetValue(
                  Ap.apply(motive, to),
                  new ReplaceNeutral(
                    neutral,
                    new Normal(motive_t, motive),
                    new Normal(base_t, base)
                  )
                )
              },
            ],
          ]),
      ],
    ])
  }
}
