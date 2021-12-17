import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class EqualValue extends Exps.BuiltInValue {
  arity = 3

  constructor(...values: Array<Value>) {
    super(
      "Equal",
      values.map((value) => ({ kind: "plain", value }))
    )
  }

  get t(): Value {
    return this.arg_value_entries[0].value
  }

  get from(): Value {
    return this.arg_value_entries[1].value
  }

  get to(): Value {
    return this.arg_value_entries[2].value
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    const values = [
      ...this.arg_value_entries.map(({ value }) => value),
      arg_value_entry.value,
    ]

    return new EqualValue(...values)
  }

  // NOTE `(T: Type, from: T, to: T) -> Type`
  self_type(): Value {
    return evaluate(
      Env.init(),
      new Exps.PiCore(
        "T",
        new Exps.BuiltInCore("Type"),
        new Exps.PiCore(
          "from",
          new Exps.VariableCore("T"),
          new Exps.PiCore(
            "to",
            new Exps.VariableCore("T"),
            new Exps.BuiltInCore("Type")
          )
        )
      )
    )
  }
}
