import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Exps from ".."
import { ApFormater } from "../pi/ap-formater"

export class ImplicitApCore extends Core {
  target: Core
  arg: Core

  constructor(target: Core, arg: Core) {
    super()
    this.target = target
    this.arg = arg
  }

  evaluate(env: Env): Value {
    return ImplicitApCore.apply(
      evaluate(env, this.target),
      evaluate(env, this.arg)
    )
  }

  ap_formater = new ApFormater(this, {
    decorate_arg: (arg) => `implicit ${arg}`,
  })

  format(): string {
    return this.ap_formater.format()
  }

  alpha_format(ctx: AlphaCtx): string {
    return `${this.target.alpha_format(ctx)}(${this.arg.alpha_format(ctx)})`
  }

  static apply(target: Value, arg: Value): Value {
    if (target.ap_handler?.implicit_apply) {
      return target.ap_handler.implicit_apply(arg)
    }

    if (target instanceof Exps.ImplicitFnValue) {
      return target.apply(arg)
    }

    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.ImplicitFnValue],
      })
    }

    if (!(target.t instanceof Exps.ImplicitPiValue)) {
      throw InternalError.wrong_target_t(target.t, {
        expected: [Exps.ImplicitPiValue],
      })
    }

    return new Exps.NotYetValue(
      target.t.ret_t_cl.apply(arg),
      new Exps.ImplicitApNeutral(
        target.neutral,
        new Normal(target.t.arg_t, arg)
      )
    )
  }
}
