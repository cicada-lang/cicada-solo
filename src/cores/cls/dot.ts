import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value, match_value } from "../../value"
import { evaluate } from "../../evaluate"
import * as Cores from "../../cores"

export class Dot extends Core {
  target: Core
  name: string

  constructor(target: Core, name: string) {
    super()
    this.target = target
    this.name = name
  }

  evaluate(env: Env): Value {
    return Cores.Dot.apply(evaluate(env, this.target), this.name)
  }

  repr(): string {
    return `${this.target.repr()}.${this.name}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}.${this.name}`
  }

  static apply(target: Value, name: string): Value {
    return match_value(target, [
      [Cores.ObjValue, (obj: Cores.ObjValue) => obj.dot(name)],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          match_value(t, [
            [
              Cores.ClsValue,
              (cls: Cores.ClsValue) =>
                new Cores.NotYetValue(
                  cls.dot(target, name),
                  new Cores.DotNeutral(neutral, name)
                ),
            ],
          ]),
      ],
    ])
  }
}
