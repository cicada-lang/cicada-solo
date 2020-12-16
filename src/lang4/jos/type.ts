import { Jo } from "../jo"
import { World } from "../world"
import { TypeValue } from "../values/type-value"

export type Type = Jo

export const Type: Type = {
  composability: (world) => world.value_stack_push(TypeValue),
  cuttability: (world) => world.value_stack_push(TypeValue),
}
