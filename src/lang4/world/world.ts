import { Stack } from "../stack"
import { Value } from "../value"
import { JoJo } from "../jos/jojo"
import { Env } from "../env"
import { Mod, Triplex } from "../mod"

export type World = {
  env: Env
  mod: Mod
  value_stack: Stack<Value>
  push: (value: Value) => World
  pop: () => [Value, World]
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
    push: (value) =>
      World({ ...the, value_stack: the.value_stack.push(value) }),
    pop: () => [
      the.value_stack.tos(),
      World({ ...the, value_stack: the.value_stack.drop() }),
    ],
    env_extend: (name, value) =>
      World({ ...the, env: the.env.extend(name, value) }),
    mod_extend: (name, triplex) =>
      World({ ...the, mod: the.mod.extend(name, triplex) }),
  }
}
