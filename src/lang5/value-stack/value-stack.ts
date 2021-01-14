import { ArrayStack } from "../array-stack"
import { Stack } from "../stack"
import { Value } from "../value"

export type ValueStack = Stack<Value> & {
  repr: () => string
}

export function ValueStack(values: Array<Value>): ValueStack {
  return {
    ...ArrayStack(values),
    repr: () =>
      "[ " +
      values
        .reverse()
        .map((value) => value.repr())
        .join(" ") +
      " ]" +
      "\n",
  }
}
