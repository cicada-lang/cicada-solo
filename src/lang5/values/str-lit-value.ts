import { Value } from "../value"

export type StrLitValue = Value & {
  kind: "StrLitValue"
  str: string
}

export function StrLitValue(str: string): StrLitValue {
  return {
    kind: "StrLitValue",
    str,
    repr: () => `"${str}"`,
    semantic_repr() {
      return this.repr()
    }
  }
}
