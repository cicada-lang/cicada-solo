import { Value } from "../value"

export type PlaceholderValue = Value & {
  kind: "PlaceholderValue"
  mark: number
}

export function PlaceholderValue(mark: number): PlaceholderValue {
  return {
    kind: "PlaceholderValue",
    mark,
    repr: () => `#${mark}`,
    semantic_repr() {
      return this.repr()
    },
  }
}

export function isPlaceholderValue(value: Value): value is PlaceholderValue {
  return value.kind === "PlaceholderValue"
}
