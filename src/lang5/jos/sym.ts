import { Jo } from "../jo"
import { World } from "../world"
import { SymValue } from "../values"
import { TypeValue } from "../values"

export type Sym = Jo & {
  kind: "Sym"
}

export const Sym: Sym = {
  kind: "Sym",
  compose: (world) => world.value_stack_push(SymValue),
  cut: (world) => world.value_stack_push(TypeValue),
  repr: () => "Symbol",
}
