import { Jo } from "../jo"
import { World } from "../world"
import { StrValue } from "../values/str-value"
import { TypeValue } from "../values/type-value"

export type Str = Jo

export const Str: Str = {
  compose: (world) => world.push(StrValue),
  cut: (world) => world.push(TypeValue),
}
