import { Exp } from "../../exp"
import { Env } from "../../env"

export type FnValue = {
  kind: "Value.fn"
  name: string
  ret: Exp
  env: Env
}

export function FnValue(name: string, ret: Exp, env: Env): FnValue {
  return {
    kind: "Value.fn",
    name,
    ret,
    env,
  }
}
