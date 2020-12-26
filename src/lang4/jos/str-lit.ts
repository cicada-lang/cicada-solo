import { Jo } from "../jo"
import { World } from "../world"
import { StrValue, StrLitValue } from "../values"

export type StrLit = Jo & {
  kind: "StrLit"
  str: string
}

export function StrLit(str: string): StrLit {
  return {
    kind: "StrLit",
    str,
    compose: (world) => world.value_stack_push(StrLitValue(str)),
    cut: (world) => world.value_stack_push(StrValue),
    repr: () => `"${str}"`,
  }
}
