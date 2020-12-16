import { Value } from "../value"
import { World } from "../world"

export type QuoteValue = Value & {
  str: string
}

export function QuoteValue(str: string): QuoteValue {
  return {
    str,
    comeout: (world) => world.value_stack_push(QuoteValue(str)),
  }
}
