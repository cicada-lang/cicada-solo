import * as Exps from "../../exps"
import { Value } from "../../value"

export class SoleValue extends Exps.BuiltInValue {
  arity = 0

  constructor(arg_value_entries: Array<Exps.ArgValueEntry> = []) {
    super("sole", arg_value_entries)
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    return new SoleValue([...this.arg_value_entries, arg_value_entry])
  }

  // NOTE `Trivial`
  self_type(): Value {
    return new Exps.TrivialValue()
  }
}
