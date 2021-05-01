import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../evaluate"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value, match_value } from "../../value"
import { Normal } from "../../normal"
import * as Cores from "../../cores"

export class AbsurdInd extends Core {
  target: Core
  motive: Core

  constructor(target: Core, motive: Core) {
    super()
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
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          match_value(t, [
            [
              Cores.AbsurdValue,
              (_: Cores.AbsurdValue) =>
                new Cores.NotYetValue(
                  motive,
                  new Cores.AbsurdIndNeutral(
                    neutral,
                    new Normal(new Cores.TypeValue(), motive)
                  )
                ),
            ],
          ]),
      ],
    ])
  }
}
