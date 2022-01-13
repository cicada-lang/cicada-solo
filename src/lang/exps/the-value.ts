import { evaluate } from "../core"
import { Env } from "../env"
import * as Exps from "../exps"
import { Value } from "../value"
import { BuiltInApHandler } from "./built-in/built-in-ap-handler"

export class TheValue extends Exps.BuiltInValue {
  name = "the"
  arity = 2

  constructor(arg_value_entries: Array<Exps.ArgValueEntry>) {
    super(arg_value_entries)
  }

  ap_handler: BuiltInApHandler = new BuiltInApHandler(this, {
    finial_apply: (arg_value_entries) => arg_value_entries[1].value,
  })

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    return new TheValue([...this.arg_value_entries, arg_value_entry])
  }

  // NOTE `(T: Type, x: T) -> T`
  self_type(): Value {
    return evaluate(
      Env.init(),
      new Exps.PiCore(
        "T",
        new Exps.BuiltInCore("Type"),
        new Exps.PiCore(
          "x",
          new Exps.VariableCore("T"),
          new Exps.VariableCore("T")
        )
      )
    )
  }
}
