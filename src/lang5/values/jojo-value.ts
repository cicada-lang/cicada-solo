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
    env: the.env,
    mod: the.mod,
    apply: (world) => jojo.jos_execute(world),
    repr: () => jojo.repr(),
    hash_repr: () => {
      const world = World({ ...the, value_stack: ValueStack([], 0) })
      console.log(">>> ", jojo.jos_execute(world).value_stack.repr())
      return jojo.jos_execute(world).value_stack.repr()
    },
  }
}
