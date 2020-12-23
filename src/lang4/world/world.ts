import { ValueStack } from "../value-stack"
import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"

export type World = {
  env: Env
  mod: Mod
  value_stack: ValueStack
  push: (value: Value) => World
  pop: () => [Value, World]
  extend: (name: string, value: Value) => World
}

export function World(the: {
  env: Env
  mod: Mod
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
    extend: (name, value) => World({
      ...the,
      env: the.env.extend(name, value)
    })
  }
}
