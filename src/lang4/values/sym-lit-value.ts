import { Value } from "../value"

export type SymLitValue = Value & {
  kind: "SymLitValue"
  str: string
}

export function SymLitValue(str: string): SymLitValue {
  return {
    kind: "SymLitValue",
    str,
    repr: () => `'${str}`,
  }
}
