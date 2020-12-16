import { Jo } from "../jo"
import { World } from "../world"
import { TypeValue } from "../values/type-value"

export type Type = Jo

export const Type: Type = {
  composability: (world) => world.push(TypeValue),
  cuttability: (world) => world.push(TypeValue),
}
