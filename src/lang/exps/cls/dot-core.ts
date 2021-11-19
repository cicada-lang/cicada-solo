import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"

export class DotCore extends Core {
  target: Core
  name: string

  constructor(target: Core, name: string) {
    super()
    this.target = target
    this.name = name
  }

  evaluate(env: Env): Value {
    return Exps.DotCore.apply(evaluate(env, this.target), this.name)
  }

  format(): string {
    return `${this.target.format()}.${this.name}`
  }

  alpha_format(ctx: AlphaCtx): string {
    return `${this.target.alpha_format(ctx)}.${this.name}`
  }

  static apply(target: Value, name: string): Value {
    if (target instanceof Exps.ObjValue) {
      return target.dot_value(name)
    } else if (target instanceof Exps.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Exps.ClsValue) {
        return new Exps.NotYetValue(
          t.dot_type(target, name),
          new Exps.DotNeutral(neutral, name)
        )
      } else {
        throw InternalError.wrong_target_t(t, {
          expected: [Exps.NilClsValue, Exps.ConsClsValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Exps.ObjValue],
      })
    }
  }
}
