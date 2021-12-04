import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { ApFormater } from "./ap-formater"

export class ApCore extends Core {
  target: Core
  arg: Core

  constructor(target: Core, arg: Core) {
    super()
    this.target = target
    this.arg = arg
  }

  evaluate(env: Env): Value {
    return ApCore.apply(evaluate(env, this.target), evaluate(env, this.arg))
  }

  ap_formater = new ApFormater(this)

  format(): string {
    return this.ap_formater.format()
  }

  alpha_format(ctx: AlphaCtx): string {
    return `${this.target.alpha_format(ctx)}(${this.arg.alpha_format(ctx)})`
  }

  static multi_apply(target: Value, args: Array<Value>): Value {
    let result: Value = target
    for (const arg of args) {
      result = Exps.ApCore.apply(result, arg)
    }

    return result
  }

  static apply(target: Value, arg: Value): Value {
    if (target.ap_handler) {
      return target.ap_handler.apply(arg)
    }

    if (target instanceof Exps.FnValue) {
      return target.ret_cl.apply(arg)
    }

    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.FnValue, Exps.NilClsValue, Exps.ConsClsValue],
      })
    }

    if (!(target.t instanceof Exps.PiValue)) {
      throw InternalError.wrong_target_t(target.t, {
        expected: [Exps.PiValue],
      })
    }

    return new Exps.NotYetValue(
      target.t.ret_t_cl.apply(arg),
      new Exps.ApNeutral(target.neutral, new Normal(target.t.arg_t, arg))
    )
  }
}
