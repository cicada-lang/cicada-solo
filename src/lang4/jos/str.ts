import { Jo } from "../jo"
import { World } from "../world"
import { StrValue } from "../values/str-value"
import { TypeValue } from "../values/type-value"

export type Str = Jo

export const Str: Str = {
  composability: (world) => world.push(StrValue),
  cuttability: (world) => world.push(TypeValue),
}
