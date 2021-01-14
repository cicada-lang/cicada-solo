import { Value } from "../value"

export type PlaceholderValue = Value & {
  kind: "PlaceholderValue"
  index: number
}

export function PlaceholderValue(index: number): PlaceholderValue {
  return {
    kind: "PlaceholderValue",
    index,
    repr: () => `#${index}`,
  }
}
