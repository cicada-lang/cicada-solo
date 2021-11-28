import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { ExpTrace } from "../../errors"

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
    if (target.dot_handler) {
      return target.dot_handler.get(name)
    }

    if (target instanceof Exps.ObjValue) {
      return target.get(name)
    }

    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.ObjValue],
      })
    }

    if (!(target.t instanceof Exps.ClsValue)) {
      throw InternalError.wrong_target_t(target.t, {
        expected: [Exps.NilClsValue, Exps.ConsClsValue],
      })
    }

    return new Exps.NotYetValue(
      target.t.get_type(target, name),
      new Exps.DotNeutral(target.neutral, name)
    )
  }
}
