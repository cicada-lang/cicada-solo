import { Stack } from "../stack"
import { Value } from "../value"
import { PlaceholderValue } from "../values"

export function InfiniteValueStack(
  values: Array<Value>,
  mark: number
): Stack<Value> {
  return {
    depth: () => values.length - mark,
    push: (value) => InfiniteValueStack([value, ...values], mark),
    drop: () =>
      values.length === 0
        ? InfiniteValueStack(values, mark - 1)
        : InfiniteValueStack(values.slice(1), mark),
    top: () => (values.length === 0 ? PlaceholderValue(mark) : values[0]),
    pop: () =>
      values.length === 0
        ? [PlaceholderValue(mark), InfiniteValueStack(values, mark - 1)]
        : [values[0], InfiniteValueStack(values.slice(1), mark)],
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
