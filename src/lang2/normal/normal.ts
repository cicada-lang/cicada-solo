import * as Ty from "../ty"
import * as Value from "../value"

export class Normal {
  constructor(public t: Ty.Ty, public value: Value.Value) {}
}
