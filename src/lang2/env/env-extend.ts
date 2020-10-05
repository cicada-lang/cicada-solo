import * as Env from "../env"
import * as Value from "../value"

export function extend(
  env: Env.Env,
  name: string,
  value: Value.Value
): Env.Env {
  return Env.update(Env.clone(env), name, value)
}
