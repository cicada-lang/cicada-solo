import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../evaluate"
import { InternalError } from "../../errors"
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
    return Value.match(target, [
      [Cores.ObjValue, (obj: Cores.ObjValue) => obj.dot_value(name)],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) => {
          if (t instanceof Cores.ClsValue) {
            const cls = t as Cores.ClsValue
            return new Cores.NotYetValue(
              cls.dot_type(target, name),
              new Cores.DotNeutral(neutral, name)
            )
          } else {
            throw InternalError.wrong_target_t(t, {
              expected: [Cores.ClsNilValue, Cores.ClsConsValue],
            })
          }
        },
      ],
    ])
  }
}
