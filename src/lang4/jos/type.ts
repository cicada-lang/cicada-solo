import { Jo } from "../jo"
import { World } from "../world"
import { TypeValue } from "../values/type-value"

export type Type = Jo

export const Type: Type = {
  composability: (world) =>
    World({
      ...world,
      value_stack: world.value_stack.push(TypeValue),
    }),
  cuttability: (world) =>
    World({
      ...world,
      value_stack: world.value_stack.push(TypeValue),
    }),
}
