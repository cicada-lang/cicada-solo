import { Jo } from "../jo"
import { World } from "../world"
import { NumValue } from "../values"
import { TypeValue } from "../values"

export type Num = Jo & {
  kind: "Num"
}

export const Num: Num = {
  kind: "Num",
  compose: (world) => world.value_stack_push(NumValue),
  repr: () => "Number",
}
