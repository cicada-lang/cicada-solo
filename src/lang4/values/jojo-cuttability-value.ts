import { Jo } from "../jo"
import { Value } from "../value"
import { ValueTable } from "../value-table"

export type JoJoCuttabilityValue = Value & {
  array: Array<Jo>
  value_table: ValueTable
}

export function JoJoCuttabilityValue(
  array: Array<Jo>,
  value_table: ValueTable
): JoJoCuttabilityValue {
  return {
    array,
    value_table,
    comeout: (world) => {
      for (const jo of array) {
        world = jo.cuttability(world)
      }
      return world
    },
  }
}
