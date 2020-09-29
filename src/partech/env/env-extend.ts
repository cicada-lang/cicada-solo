import * as Env from "../env"
import * as Value from "../value"

export function extend(
  env: Env.Env,
  name: string,
  values: Array<Value.Value>
): Env.Env {
  return new Map([...env, [name, values]])
}
