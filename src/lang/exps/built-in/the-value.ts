import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { TheApHandler } from "./the-ap-handler"

export class TheValue extends Exps.BuiltInValue {
  constructor() {
    super("the")
  }

  ap_handler = new TheApHandler(this)

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
