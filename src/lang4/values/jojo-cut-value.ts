import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"
import { JoJo } from "../jos"

export type JoJoCutValue = Value & {
  kind: "JoJoCutValue"
  jojo: JoJo
  env: Env
  mod: Mod
}

export function JoJoCutValue(
  jojo: JoJo,
  the: {
    env: Env
    mod: Mod
  }
): JoJoCutValue {
  return {
    kind: "JoJoCutValue",
    jojo,
    env: the.env,
    mod: the.mod,
    refer: (world) => jojo.jos_cut(world),
    repr: () => "#cut " + jojo.repr(),
  }
}
