import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value, match_value } from "../../value"
import { evaluate } from "../../evaluate"
import { infer } from "../../infer"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Dot extends Exp {
  target: Exp
  name: string

  constructor(target: Exp, name: string) {
    super()
    this.target = target
    this.name = name
  }

  evaluate(env: Env): Value {
    return Dot.apply(evaluate(env, this.target), this.name)
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)

    if (
      target_t instanceof Cores.ClsValue ||
      target_t instanceof Cores.ExtValue
    ) {
      return target_t.dot(evaluate(ctx.to_env(), this.target), this.name)
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

  static apply(target: Value, name: string): Value {
    return match_value(target, [
      [Cores.ObjValue, (obj: Cores.ObjValue) => obj.dot(name)],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          match_value(t, [
            [
              Cores.ClsValue,
              (cls: Cores.ClsValue) =>
                new Cores.NotYetValue(
                  cls.dot(target, name),
                  new Cores.DotNeutral(neutral, name)
                ),
            ],
          ]),
      ],
    ])
  }
}
