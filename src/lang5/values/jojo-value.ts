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
    hash_repr: () => {
      const world = World({ ...the, value_stack: ValueStack([], 0) })
      const value_stack = jojo.jos_execute(world).value_stack
      return (
        "[ " +
        value_stack.values
          .map((value) => (value.hash_repr ? value.hash_repr() : value.repr()))
          .join(" ") +
        " ] " +
        `${value_stack.mark}` +
        "\n"
      )
    },
  }
}
