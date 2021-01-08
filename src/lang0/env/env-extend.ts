import * as Env from "../env"
import * as Value from "../value"

export function extend(
  env: Env.Env,
  name: string,
  value: Value.Value
): Env.Env {
  const new_env = Env.clone(env)
  new_env.set(name, value)
  return new_env
}
