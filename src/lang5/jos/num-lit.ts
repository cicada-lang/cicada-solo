import { Jo } from "../jo"
import { World } from "../world"
import { NumLitValue } from "../values"

export type NumLit = Jo & {
  kind: "NumLit"
  num: number
}

export function NumLit(num: number): NumLit {
  return {
    kind: "NumLit",
    num,
    compose: (world) => world.value_stack_push(NumLitValue(num)),
    repr: () => `${num}`,
  }
}
