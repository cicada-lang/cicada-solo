import { Value } from "../value"
import { World } from "../world"

export type StrValue = Value

export const StrValue: StrValue = {
  comeout: (world) => world.value_stack_push(StrValue),
}
