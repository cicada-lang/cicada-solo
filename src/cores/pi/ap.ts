import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Cores from "../../cores"

export class Ap extends Core {
  target: Core
  arg: Core

  constructor(target: Core, arg: Core) {
    super()
    this.target = target
    this.arg = arg
  }

  evaluate(env: Env): Value {
    return Ap.apply(evaluate(env, this.target), evaluate(env, this.arg))
  }

  private multi_ap(args: Array<Core> = new Array()): {
    target: Core
    args: Array<Core>
  } {
    if (this.target instanceof Ap) {
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
    if (target instanceof Cores.FnValue) {
      return target.apply(arg)
    } else if (target instanceof Cores.ClsValue) {
      return target.apply(arg)
    } else if (target instanceof Cores.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Cores.PiValue) {
        return new Cores.NotYetValue(
          t.ret_t_cl.apply(arg),
          new Cores.ApNeutral(neutral, new Normal(t.arg_t, arg))
        )
      } else {
        throw new InternalError(
          [
            `I expect the type of the neutral to be an instance of PiValue`,
            `but the constructor name I meet is: ${t.constructor.name}`,
          ].join("\n") + "\n"
        )
      }
    } else {
      throw new InternalError(
        [
          `I expect the target to be an instance of FnValue or ClsValue`,
          `but the constructor name I meet is: ${target.constructor.name}`,
        ].join("\n") + "\n"
      )
    }
  }
}
