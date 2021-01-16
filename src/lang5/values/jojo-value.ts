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
    alpha_repr: () => {
      const world = World({ ...the, value_stack: ValueStack([], 0) })
      const final = jojo.jos_execute(world)
      return final.value_stack.alpha_repr()
    },
  }
}
