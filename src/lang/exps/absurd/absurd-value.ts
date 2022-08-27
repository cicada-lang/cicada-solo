import * as Exps from "../../exps"
import { Value } from "../../value"

export class AbsurdValue extends Exps.GlobalValue {
  name = "Absurd"
  arity = 0

  constructor(arg_value_entries: Array<Exps.ArgValueEntry> = []) {
    super(arg_value_entries)
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.GlobalValue {
    return new AbsurdValue([...this.arg_value_entries, arg_value_entry])
  }

  // NOTE `Type`
  self_type(): Value {
    return new Exps.TypeValue()
  }
}
