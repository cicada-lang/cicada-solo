import { Value } from "../value"

export type Normal = {
  t: Value
  value: Value
}

export function Normal(t: Value, value: Value): Normal {
  return { t, value }
}
