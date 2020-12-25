import { Value } from "../value"
import { World } from "../world"

export class QuoteValue extends Value {
  constructor(public str: string) {
    super()
  }
}
