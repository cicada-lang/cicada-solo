import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"
import { JoJo } from "../jos"

export type JoJoComposeValue = Value & {
  kind: "JoJoComposeValue"
  jojo: JoJo
  env: Env
  mod: Mod
}

export function JoJoComposeValue(
  jojo: JoJo,
  the: {
    env: Env
    mod: Mod
  }
): JoJoComposeValue {
  return {
    kind: "JoJoComposeValue",
    jojo,
    env: the.env,
    mod: the.mod,
    refer: (world) => jojo.jos_compose(world),
    repr: () => "#compose " + jojo.repr(),
  }
}
