import { Value } from "../value"
import { World } from "../world"
import { ValueStack } from "../value-stack"
import { Env } from "../env"
import { Mod } from "../mod"
import { JoJo } from "../jos"

export type JoJoValue = Value & {
  kind: "JoJoValue"
  jojo: JoJo
  env: Env
  mod: Mod
}

export function JoJoValue(
  jojo: JoJo,
  the: {
    env: Env
    mod: Mod
  }
): JoJoValue {
  return {
    kind: "JoJoValue",
    jojo,
    ...the,
    apply: (world) => jojo.jos_execute(world),
    repr: () => jojo.repr(),
    semantic_repr: () => {
      const world = World({ ...the, value_stack: ValueStack([], 0) })
      const final = jojo.jos_execute(world)
      const value_repr = (value: Value) => (value.semantic_repr || value.repr)()
      const application_trace_repr = world.application_trace
        .map((value_stack) => value_stack.repr_by(value_repr))
        .join("")
      const value_stack_repr = final.value_stack.repr_by(value_repr)
      // console.log(value_stack_repr + application_trace_repr)
      return value_stack_repr + application_trace_repr
    },
  }
}
