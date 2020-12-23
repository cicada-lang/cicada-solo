import { ValueStack } from "../value-stack"
import { Value } from "../value"
import { Env } from "../env"

export type World = {
  env: Env
  value_stack: ValueStack
  push: (value: Value) => World
  pop: () => [Value, World]
  define: (name: string, value: Value) => World
}

export function World(the: {
  env: Env
  value_stack: ValueStack
}): World {
  return {
    ...the,
    push: (value) =>
      World({
        ...the,
        value_stack: the.value_stack.push(value),
      }),
    pop: () => [
      the.value_stack.tos(),
      World({
        ...the,
        value_stack: the.value_stack.drop(),
      }),
    ],
    define: (name, value) =>
      World({
        ...the,
        env: the.env.define(name, value),
      }),
  }
}
