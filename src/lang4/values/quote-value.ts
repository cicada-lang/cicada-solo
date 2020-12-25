import { Value } from "../value"

export class QuoteValue implements Value {
  constructor(public ustr: string) {}
}
