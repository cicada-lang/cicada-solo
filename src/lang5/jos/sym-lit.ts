import { Jo } from "../jo"
import { World } from "../world"
import { SymLitValue } from "../values"

export type SymLit = Jo & {
  kind: "SymLit"
  str: string
}

export function SymLit(str: string): SymLit {
  return {
    kind: "SymLit",
    str,
    compose: (world) => world.value_stack_push(SymLitValue(str)),
    repr: () => `'${str}`,
  }
}
