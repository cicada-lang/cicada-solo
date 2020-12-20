import { Exp } from "../../exp"
import { Value } from "../../value"
import { Env } from "../../env"

export type FnValue = {
  kind: "FnValue"
  name: string
  ret: Exp
  env: Env
}

export function FnValue(name: string, ret: Exp, env: Env): FnValue {
  return {
    kind: "FnValue",
    name,
    ret,
    env,
  }
}

export function is_fn_value(value: Value): value is FnValue {
  return value.kind === "FnValue"
}

export function as_fn_value(value: Value): FnValue {
  if (is_fn_value(value)) return value
  throw new Error("Expecting FnValue")
}
