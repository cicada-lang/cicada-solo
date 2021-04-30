import { Exp, AlphaCtx } from "../../exp"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value, match_value } from "../../value"
import { Normal } from "../../normal"
import { Trace } from "../../trace"
import { NotYetValue } from "../../exps"
import { AbsurdValue, AbsurdIndNeutral } from "../../exps"
import { TypeValue } from "../../exps"

export class AbsurdInd implements Exp {
  target: Exp
  motive: Exp

  constructor(target: Exp, motive: Exp) {
    this.target = target
    this.motive = motive
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return AbsurdInd.apply(
      evaluate(ctx, env, this.target),
      evaluate(ctx, env, this.motive)
    )
  }

  infer(ctx: Ctx): Value {
    // NOTE the `motive` here is not a function from target_t to type,
    //   but a element of type.
    // NOTE We should always infer target,
    //   but we do a simple check for the simple absurd.
    check(ctx, this.target, new AbsurdValue())
    check(ctx, this.motive, new TypeValue())
    const motive_value = evaluate(ctx, ctx.to_env(), this.motive)
    return motive_value
  }

  repr(): string {
    return `absurd_ind(${this.target.repr()}, ${this.motive.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `absurd_ind(${this.target.alpha_repr(ctx)}, ${this.motive.alpha_repr(
      ctx
    )})`
  }

  static apply(target: Value, motive: Value): Value {
    return match_value(target, [
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              AbsurdValue,
              (_: AbsurdValue) =>
                new NotYetValue(
                  motive,
                  new AbsurdIndNeutral(
                    neutral,
                    new Normal(new TypeValue(), motive)
                  )
                ),
            ],
          ]),
      ],
    ])
  }
}
