import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Sem from "../../sem"

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
    if (target instanceof Sem.FnValue) {
      return target.apply(arg)
    } else if (target instanceof Sem.ClsValue) {
      return target.apply(arg)
    } else if (target instanceof Sem.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Sem.PiValue) {
        return new Sem.NotYetValue(
          t.ret_t_cl.apply(arg),
          new Sem.ApNeutral(neutral, new Normal(t.arg_t, arg))
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Sem.PiValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Sem.FnValue, Sem.ClsNilValue, Sem.ClsConsValue],
      })
    }
  }
}
