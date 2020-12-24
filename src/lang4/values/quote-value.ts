import { Value } from "../value"

export class QuoteValue implements Value {
  kind = "QuoteValue"

  constructor(public ustr: string) {}
}
