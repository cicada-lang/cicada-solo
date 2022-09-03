import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Normal } from "../../normal"
import { Value } from "../../value"
import { ApFormater } from "./ap-formater"

export class ApCore extends Core {
  target: Core
  arg: Core

  constructor(target: Core, arg: Core) {
    super()
    this.target = target
    this.arg = arg
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.arg.free_names(bound_names),
    ])
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

  static apply(target: Value, arg: Value): Value {
    if (target.ap_handler?.apply) {
      return target.ap_handler.apply({ kind: "plain", value: arg })
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
      new Exps.ApNeutral(target.neutral, new Normal(target.t.arg_t, arg)),
    )
  }
}
