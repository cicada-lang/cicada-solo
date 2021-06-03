import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../evaluate"
import * as Cores from "../../cores"

export class VectorHead extends Core {
  target: Core

  constructor(target: Core) {
    super()
    this.target = target
  }

  evaluate(env: Env): Value {
    return VectorHead.apply(evaluate(env, this.target))
  }

  repr(): string {
    return `vector_head(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `vector_head(${this.target.alpha_repr(ctx)})`
  }

  static apply(target: Value): Value {
    return Value.match(target, [
      [Cores.VecValue, (vec: Cores.VecValue) => vec.head],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          Value.match(t, [
            [
              Cores.VectorValue,
              (vector_t: Cores.VectorValue) =>
                Value.match(vector_t.length, [
                  [
                    Cores.Add1Value,
                    (_length: Cores.Add1Value) =>
                      new Cores.NotYetValue(
                        vector_t.elem_t,
                        new Cores.VectorHeadNeutral(neutral)
                      ),
                  ],
                ]),
            ],
          ]),
      ],
    ])
  }
}
