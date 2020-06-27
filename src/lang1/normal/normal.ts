import * as Ty from "../ty"
import * as Value from "../value"

export class Normal {
  t: Ty.Ty
  value: Value.Value

  constructor (the: {
    t: Ty.Ty
    value: Value.Value
  }) {
    this.t = the.t
    this.value = the.value
  }
}
