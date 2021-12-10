import * as Exps from "../../exps"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"

export class TheValue extends Exps.BuiltInValue {
  constructor() {
    super("the")
  }

  // NOTE `the: (T: Type, x: T) -> T`
  self_type(): Value {
    const env = Env.init()

    const t = new Exps.PiCore(
      "T",
      new Exps.TypeCore(),
      new Exps.PiCore(
        "x",
        new Exps.VariableCore("T"),
        new Exps.VariableCore("T")
      )
    )

    return evaluate(env, t)
  }
}
