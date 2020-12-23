import { Value } from "../value"

export type ValueStack = {
  stack: Array<Value>
  push: (value: Value) => ValueStack
  drop: () => ValueStack
  tos: () => Value
  pop: () => [Value, ValueStack]
}

export function ValueStack(stack: Array<Value>): ValueStack {
  return {
    stack,
    push: (value) => ValueStack([value, ...stack]),
    drop: () => ValueStack(stack.slice(1)),
    tos: () => stack[0],
    pop: () => [stack[0], ValueStack(stack.slice(1))],
  }
}
