import { Jo } from "../jo"
import { World } from "../world"
import { StrValue } from "../values/str-value"
import { TypeValue } from "../values/type-value"

export type Str = Jo & {
  kind: "Str"
}

export const Str: Str = {
  kind: "Str",
  compose: (world) => world.push(StrValue),
  cut: (world) => world.push(new TypeValue()),
}
