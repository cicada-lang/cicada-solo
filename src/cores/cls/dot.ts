import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../exp"
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
    if (target instanceof Cores.ObjValue) {
      return target.dot_value(name)
    } else if (target instanceof Cores.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Cores.ClsValue) {
        return new Cores.NotYetValue(
          t.dot_type(target, name),
          new Cores.DotNeutral(neutral, name)
        )
      } else {
        throw InternalError.wrong_target_t(t, {
          expected: [Cores.ClsNilValue, Cores.ClsConsValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Cores.ObjValue],
      })
    }
  }
}
