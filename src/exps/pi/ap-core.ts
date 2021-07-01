import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"

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

  private multi_ap(args: Array<Core> = new Array()): {
    target: Core
    args: Array<Core>
  } {
    if (this.target instanceof ApCore) {
      return this.target.multi_ap([this.arg, ...args])
    } else {
      return { target: this.target, args: [this.arg, ...args] }
    }
  }

  repr(): string {
    const { target, args } = this.multi_ap()
    return `${target.repr()}(${args.map((arg) => arg.repr()).join(", ")})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}(${this.arg.alpha_repr(ctx)})`
  }

  static apply(target: Value, arg: Value): Value {
    if (target instanceof Exps.FnValue) {
      return target.apply(arg)
    } else if (target instanceof Exps.ClsValue) {
      return target.apply(arg)
    } else if (target instanceof Exps.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Exps.PiValue) {
        return new Exps.NotYetValue(
          t.ret_t_cl.apply(arg),
          new Exps.ApNeutral(neutral, new Normal(t.arg_t, arg))
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Exps.PiValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Exps.FnValue, Exps.ClsNilValue, Exps.ClsConsValue],
      })
    }
  }
}
