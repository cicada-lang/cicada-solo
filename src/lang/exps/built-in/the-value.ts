import * as Exps from "../../exps"
import { Value } from "../../value"

export class TheValue extends Exps.BuiltInValue {
  constructor() {
    super("the")
  }

  // NOTE `the: (T: Type, x: T) -> T`
  self_type(): Value {
    throw new Error()
  }
}
