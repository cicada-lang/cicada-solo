import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { Value, match_value } from "../../value"
import { Normal } from "../../normal"
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

  repr(): string {
    return `${this.target.repr()}(${this.arg.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}(${this.arg.alpha_repr(ctx)})`
  }

  static apply(target: Value, arg: Value): Value {
    return match_value(target, [
      [Cores.FnValue, (fn: Cores.FnValue) => fn.ret_cl.apply(arg)],
      [Cores.ClsValue, (cls: Cores.ClsValue) => cls.apply(arg)],
      [Cores.ExtValue, (ext: Cores.ExtValue) => ext.apply(arg)],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          match_value(t, [
            [
              Cores.PiValue,
              (pi: Cores.PiValue) =>
                new Cores.NotYetValue(
                  pi.ret_t_cl.apply(arg),
                  new Cores.ApNeutral(neutral, new Normal(pi.arg_t, arg))
                ),
            ],
          ]),
      ],
    ])
  }
}
