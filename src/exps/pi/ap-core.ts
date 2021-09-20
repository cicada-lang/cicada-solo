import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
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

  ap_args_repr(): Array<string> {
    if (has_ap_args_repr(this.target)) {
      return [...this.target.ap_args_repr(), this.arg.repr()]
    } else {
      return [this.arg.repr()]
    }
  }

  ap_target_repr(): string {
    if (has_ap_target_repr(this.target)) {
      return this.target.ap_target_repr()
    } else {
      return this.target.repr()
    }
  }

  repr(): string {
    const target = this.ap_target_repr()
    const args = this.ap_args_repr().join(", ")
    return `${target}(${args})`
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
        expected: [Exps.FnValue, Exps.NilClsValue, Exps.ConsClsValue],
      })
    }
  }
}

function has_ap_args_repr(
  core: Core
): core is Core & { ap_args_repr(): Array<string> } {
  return (core as any).ap_args_repr instanceof Function
}

function has_ap_target_repr(
  core: Core
): core is Core & { ap_target_repr(): string } {
  return (core as any).ap_target_repr instanceof Function
}
