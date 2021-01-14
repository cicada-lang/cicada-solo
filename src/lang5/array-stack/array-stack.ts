import { Stack } from "../stack"

export type ArrayStack<A> = Stack<A>

export function ArrayStack<A>(values: Array<A>): ArrayStack<A> {
  return {
    empty_p: () => values.length === 0,
    push: (value) => ArrayStack([value, ...values]),
    drop: () => ArrayStack(values.slice(1)),
    top: () => values[0],
    pop: () => [values[0], ArrayStack(values.slice(1))],
    repr: (value_repr: (value: A) => string) =>
      "[ " +
      values
        .reverse()
        .map((value) => value_repr(value))
        .join(" ") +
      " ]" +
      "\n",
  }
}
