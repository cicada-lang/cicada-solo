import { Jo } from "../jo"
import { World } from "../world"
import { StrLitValue } from "../values"

export type StrLit = Jo & {
  kind: "StrLit"
  str: string
}

export function StrLit(str: string): StrLit {
  return {
    kind: "StrLit",
    str,
    execute: (world) => world.value_stack_push(StrLitValue(str)),
    repr: () => `"${str}"`,
  }
}
