import { Stack } from "../stack"
import { Value, value_equal } from "../value"
import { JoJo } from "../jos/jojo"
import { Env } from "../env"
import { Mod } from "../mod"

export type World = {
  env: Env
  mod: Mod
  value_stack: Stack<Value>
  value_stack_push: (value: Value) => World
  value_stack_pop: () => [Value, World]
  value_stack_match_values: (values: Array<Value>) => World
  values: Array<Value>
  env_extend: (name: string, value: Value) => World
  mod_extend: (name: string, jojo: JoJo) => World
}

export function World(the: {
  env: Env
  mod: Mod
  value_stack: Stack<Value>
}): World {
  return {
    ...the,
    value_stack_push: (value) =>
      World({ ...the, value_stack: the.value_stack.push(value) }),
    value_stack_pop: () => [
      the.value_stack.tos(),
      World({ ...the, value_stack: the.value_stack.drop() }),
    ],
    value_stack_match_values: (values) =>
      World({
        ...the,
        value_stack: [...values].reverse().reduce((value_stack, value) => {
          if (!value_equal(value_stack.tos(), value)) {
            const message = "World.value_stack_match_values fail"
            console.log({
              message,
              top_of_stack_value: value_stack.tos(),
              value: value,
            })
            throw new Error(message)
          }
          return value_stack.drop()
        }, the.value_stack),
      }),
    values: the.value_stack.values,
    env_extend: (name, value) =>
      World({ ...the, env: the.env.extend(name, value) }),
    mod_extend: (name, jojo) =>
      World({ ...the, mod: the.mod.extend(name, jojo) }),
  }
}
