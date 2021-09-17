import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Subst } from "../../subst"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"

export class ApImCore extends Core {
  target: Core
  arg: Core

  constructor(target: Core, arg: Core) {
    super()
    this.target = target
    this.arg = arg
  }

  evaluate(env: Env): Value {
    return ApImCore.apply(evaluate(env, this.target), evaluate(env, this.arg))
  }

  multi_ap_repr(args: Array<string> = new Array()): {
    target: string
    args: Array<string>
  } {
    const arg = `given ${this.arg.repr()}`
    if (
      this.target instanceof Exps.ApCore ||
      this.target instanceof Exps.ApImCore
    ) {
      return this.target.multi_ap_repr([arg, ...args])
    } else {
      return {
        target: this.target.repr(),
        args: [arg, ...args],
      }
    }
  }

  repr(): string {
    const { target, args } = this.multi_ap_repr()
    return `${target}(${args.join(", ")})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}(${this.arg.alpha_repr(ctx)})`
  }

  static apply(target: Value, arg: Value): Value {
    if (target instanceof Exps.ImFnValue) {
      return target.apply(arg)
    } else if (target instanceof Exps.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Exps.ImPiValue) {
        return new Exps.NotYetValue(
          t.ret_t_cl.apply(arg),
          new Exps.ApImNeutral(neutral, new Normal(t.arg_t, arg))
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Exps.ImPiValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Exps.ImFnValue],
      })
    }
  }
}
