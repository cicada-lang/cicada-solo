import { Jo } from "../jo"
import { Value } from "../value"
import { ValueTable } from "../value-table"

export type JoJoComposabilityValue = Value & {
  array: Array<Jo>
  value_table: ValueTable
}

export function JoJoComposabilityValue(
  array: Array<Jo>,
  value_table: ValueTable
): JoJoComposabilityValue {
  return {
    array,
    value_table,
    comeout: (world) => {
      // TODO
      return world
    },
  }
}
