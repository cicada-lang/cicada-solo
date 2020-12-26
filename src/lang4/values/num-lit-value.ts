import { Value } from "../value"

export type NumLitValue = Value & {
  kind: "NumLitValue"
  num: number
}

export function NumLitValue(num: number): NumLitValue {
  return {
    kind: "NumLitValue",
    num,
    repr: () => `${num}`,
  }
}
