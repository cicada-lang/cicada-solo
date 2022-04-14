import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { BuiltInApHandler } from "../built-in/built-in-ap-handler"

export class PairValue extends Exps.BuiltInValue {
  name = "Pair"
  arity = 2

  constructor(arg_value_entries: Array<Exps.ArgValueEntry>) {
    super(arg_value_entries)
  }

  ap_handler: BuiltInApHandler = new BuiltInApHandler(this, {
    finial_apply: (arg_value_entries) =>
      evaluate(
        Env.init()
          .extend("A", arg_value_entries[0].value)
          .extend("B", arg_value_entries[1].value),
        new Exps.SigmaCore("_", new Exps.VarCore("A"), new Exps.VarCore("B"))
      ),
  })

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    return new PairValue([...this.arg_value_entries, arg_value_entry])
  }

  // NOTE `(A: Type, B: Type) -> Type`
  self_type(): Value {
    return evaluate(
      Env.init(),
      new Exps.PiCore(
        "A",
        new Exps.BuiltInCore("Type"),
        new Exps.PiCore(
          "B",
          new Exps.BuiltInCore("Type"),
          new Exps.BuiltInCore("Type")
        )
      )
    )
  }
}

export class BothValue extends PairValue {
  name = "Both"
}
