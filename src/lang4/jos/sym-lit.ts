import { Jo } from "../jo"
import { World } from "../world"
import { SymValue, SymLitValue } from "../values"

export type SymLit = Jo & {
  kind: "SymLit"
  str: string
}

export function SymLit(str: string): SymLit {
  return {
    kind: "SymLit",
    str,
    compose: (world) => world.value_stack_push(SymLitValue(str)),
    cut: (world) => world.value_stack_push(SymValue),
    repr: () => `'${str}`,
  }
}
