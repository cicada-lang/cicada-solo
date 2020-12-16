import { FrameStack } from "../frame-stack"
import { ValueStack } from "../value-stack"
import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"

export type World = {
  env: Env
  mod: Mod
  value_stack: ValueStack
  return_stack: FrameStack
  value_stack_push: (value: Value) => World
  value_stack_pop: () => [Value, World]
}

export function World(the: {
  env: Env
  mod: Mod
  value_stack: ValueStack
  return_stack: FrameStack
}): World {
  return {
    ...the,
    value_stack_push: (value) =>
      World({
        ...the,
        value_stack: the.value_stack.push(value),
      }),
    value_stack_pop: () => [
      the.value_stack.tos(),
      World({
        ...the,
        value_stack: the.value_stack.drop(),
      }),
    ],
  }
}
