import * as Exps from "../../exps"
import { Value } from "../../value"

export class SoleValue extends Exps.GlobalValue {
  name = "sole"
  arity = 0

  constructor(arg_value_entries: Array<Exps.ArgValueEntry> = []) {
    super(arg_value_entries)
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.GlobalValue {
    return new SoleValue([...this.arg_value_entries, arg_value_entry])
  }

  // NOTE `Trivial`
  self_type(): Value {
    return new Exps.TrivialValue()
  }
}
