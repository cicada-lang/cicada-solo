import * as Exps from "../../exps"
import { Value } from "../../value"

export class TypeValue extends Exps.GlobalValue {
  name = "Type"
  arity = 0

  constructor(arg_value_entries: Array<Exps.ArgValueEntry> = []) {
    super(arg_value_entries)
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.GlobalValue {
    return new TypeValue([...this.arg_value_entries, arg_value_entry])
  }

  // NOTE `Type`
  self_type(): Value {
    return new Exps.TypeValue()
  }
}
