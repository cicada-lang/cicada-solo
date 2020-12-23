import { Jo } from "../jo"
import { World } from "../world"
import { TypeValue } from "../values/type-value"

export type Type = Jo

export const Type: Type = {
  compose: (world) => world.push(TypeValue),
  cut: (world) => world.push(TypeValue),
}
