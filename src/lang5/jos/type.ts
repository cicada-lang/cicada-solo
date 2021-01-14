import { Jo } from "../jo"
import { World } from "../world"
import { TypeValue } from "../values"

export type Type = Jo & {
  kind: "Type"
}

export const Type: Type = {
  kind: "Type",
  compose: (world) => world.value_stack_push(TypeValue),
  repr: () => "Type",
}
