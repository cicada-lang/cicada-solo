import { Value } from "../value"

export type SymLitValue = Value & {
  kind: "SymLitValue"
  sym: string
}

export function SymLitValue(sym: string): SymLitValue {
  return {
    kind: "SymLitValue",
    sym,
    repr: () => `'${sym}`,
  }
}
