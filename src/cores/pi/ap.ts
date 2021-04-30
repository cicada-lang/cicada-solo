import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { infer } from "../../infer"
import { check } from "../../check"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { expect } from "../../expect"
import { Normal } from "../../normal"
import { NotYetValue } from "../../cores"
import { FnValue, PiValue, ApNeutral } from "../../cores"
import { ClsValue, ExtValue, TypeValue } from "../../cores"
import { Trace } from "../../trace"
import * as ut from "../../ut"

export class Ap implements Core {
  target: Core
  arg: Core

  constructor(target: Core, arg: Core) {
    this.target = target
    this.arg = arg
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return Ap.apply(
      evaluate(ctx, env, this.target),
      evaluate(ctx, env, this.arg)
    )
  }

  repr(): string {
    return `${this.target.repr()}(${this.arg.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}(${this.arg.alpha_repr(ctx)})`
  }

  static apply(target: Value, arg: Value): Value {
    return match_value(target, [
      [FnValue, (fn: FnValue) => fn.ret_cl.apply(arg)],
      [ClsValue, (cls: ClsValue) => cls.apply(arg)],
      [ExtValue, (ext: ExtValue) => ext.apply(arg)],
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              PiValue,
              (pi: PiValue) =>
                new NotYetValue(
                  pi.ret_t_cl.apply(arg),
                  new ApNeutral(neutral, new Normal(pi.arg_t, arg))
                ),
            ],
          ]),
      ],
    ])
  }
}
