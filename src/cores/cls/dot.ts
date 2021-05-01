import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value, match_value } from "../../value"
import { ClsValue, ObjValue } from "../../cores"
import { DotNeutral, NotYetValue } from "../../cores"
import { evaluate } from "../../evaluate"

export class Dot extends Core {
  target: Core
  name: string

  constructor(target: Core, name: string) {
    super()
    this.target = target
    this.name = name
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return Dot.apply(evaluate(ctx, env, this.target), this.name)
  }

  repr(): string {
    return `${this.target.repr()}.${this.name}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}.${this.name}`
  }

  static apply(target: Value, name: string): Value {
    return match_value(target, [
      [ObjValue, (obj: ObjValue) => obj.dot(name)],
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              ClsValue,
              (cls: ClsValue) =>
                new NotYetValue(
                  cls.dot(target, name),
                  new DotNeutral(neutral, name)
                ),
            ],
          ]),
      ],
    ])
  }
}
