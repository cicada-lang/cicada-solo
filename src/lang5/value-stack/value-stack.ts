import { Value } from "../value"
import { PlaceholderValue, isPlaceholderValue } from "../values"

export type ValueStack = {
  mark: number
  values: Array<Value>
  depth: () => number
  push: (value: Value) => ValueStack
  drop: () => ValueStack
  top: () => Value
  pop: () => [Value, ValueStack]
  repr: () => string
}

export function ValueStack(values: Array<Value>, mark: number): ValueStack {
  return {
    mark,
    values,
    depth: () => values.length - mark,
    push: (value) =>
      // NOTE Handle normalization.
      // - for example: [ swap swap ] == []
      values.length === 0 &&
      isPlaceholderValue(value) &&
      value.mark === mark - 1
        ? ValueStack(values, mark - 1)
        : ValueStack([value, ...values], mark),
    drop: () =>
      values.length === 0
        ? ValueStack(values, mark + 1)
        : ValueStack(values.slice(1), mark),
    top: () => (values.length === 0 ? PlaceholderValue(mark) : values[0]),
    pop() {
      return [this.top(), this.drop()]
    },
    repr: () =>
      "[ " +
      values
        .reverse()
        .map((value) => value.repr())
        .join(" ") +
      " ] " +
      `${mark}` +
      "\n",
  }
}
