import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value, match_value } from "../../value"
import { Normal } from "../../normal"
import { Trace } from "../../trace"
import { NotYetValue } from "../../cores"
import { AbsurdValue, AbsurdIndNeutral } from "../../cores"
import { TypeValue } from "../../cores"

export class AbsurdInd implements Core {
  target: Core
  motive: Core

  constructor(target: Core, motive: Core) {
    this.target = target
    this.motive = motive
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return AbsurdInd.apply(
      evaluate(ctx, env, this.target),
      evaluate(ctx, env, this.motive)
    )
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
