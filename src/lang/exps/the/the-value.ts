import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { GlobalApHandler } from "../built-in/built-in-ap-handler"

export class TheValue extends Exps.GlobalValue {
  name = "the"
  arity = 2

  constructor(arg_value_entries: Array<Exps.ArgValueEntry>) {
    super(arg_value_entries)
  }

  ap_handler: GlobalApHandler = new GlobalApHandler(this, {
    finial_apply: (arg_value_entries) => arg_value_entries[1].value,
  })

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.GlobalValue {
    return new TheValue([...this.arg_value_entries, arg_value_entry])
  }

  // NOTE `(T: Type, x: T) -> T`
  self_type(): Value {
    return evaluate(
      Env.init(),
      new Exps.PiCore(
        "T",
        new Exps.GlobalCore("Type"),
        new Exps.PiCore("x", new Exps.VarCore("T"), new Exps.VarCore("T"))
      )
    )
  }
}
