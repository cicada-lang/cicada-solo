import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { TheApHandler } from "./the-ap-handler"

export class TheValue extends Exps.BuiltInValue {
  arity = 2

  constructor(curried_arg_value_entries: Array<Exps.ArgValueEntry>) {
    super("the", curried_arg_value_entries)
  }

  ap_handler = new TheApHandler(this)

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    return new TheValue([...this.curried_arg_value_entries, arg_value_entry])
  }

  // NOTE `(T: Type, x: T) -> T`
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
