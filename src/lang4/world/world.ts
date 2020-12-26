import { Stack } from "../stack"
import { Value } from "../value"
import { JoJo } from "../jos/jojo"
import { Env } from "../env"
import { Mod, Triplex } from "../mod"
import * as ut from "../../ut"

export type World = {
  env: Env
  mod: Mod
  value_stack: Stack<Value>
  value_stack_push: (value: Value) => World
  value_stack_pop: () => [Value, World]
  value_stack_match_values: (values: Array<Value>) => World
  env_extend: (name: string, value: Value) => World
  mod_extend: (name: string, triplex: Triplex) => World
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
          if (
            // TODO fix value_equal
            !ut.equal(JSON.stringify(value_stack.tos()), JSON.stringify(value))
          ) {
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
    env_extend: (name, value) =>
      World({ ...the, env: the.env.extend(name, value) }),
    mod_extend: (name, triplex) =>
      World({ ...the, mod: the.mod.extend(name, triplex) }),
  }
}
