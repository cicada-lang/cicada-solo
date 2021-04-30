import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value, match_value } from "../../value"
import { ClsValue, ExtValue, ObjValue } from "../../cores"
import { DotNeutral, NotYetValue } from "../../cores"
import { evaluate } from "../../evaluate"
import { infer } from "../../infer"
import { Trace } from "../../trace"
import * as ut from "../../ut"

export class Dot extends Exp {
  target: Exp
  name: string

  constructor(target: Exp, name: string) {
    super()
    this.target = target
    this.name = name
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return Dot.apply(evaluate(ctx, env, this.target), this.name)
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)

    if (target_t instanceof ClsValue || target_t instanceof ExtValue) {
      return target_t.dot(evaluate(ctx, ctx.to_env(), this.target), this.name)
    }

    throw new Trace(
      ut.aline(`
        |Expecting target type to be a class.
        |  ${ut.inspect(target_t)}
        |`)
    )
  }

  repr(): string {
    return `${this.target.repr()}.${this.name}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}.${this.name}`
  }

  static apply(target: Value, name: string): Value {
    return match_value(target, [
      [ObjValue, (obj: ObjValue) => obj.dot(name)],
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              ClsValue,
              (cls: ClsValue) =>
                new NotYetValue(
                  cls.dot(target, name),
                  new DotNeutral(neutral, name)
                ),
            ],
          ]),
      ],
    ])
  }
}
