import { Jo } from "../jo"
import { World } from "../world"
import { StrValue } from "../values"
import { TypeValue } from "../values"

export type Str = Jo & {
  kind: "Str"
}

export const Str: Str = {
  kind: "Str",
  compose: (world) => world.value_stack_push(StrValue),
  cut: (world) => world.value_stack_push(TypeValue),
  repr: () => "String",
}
