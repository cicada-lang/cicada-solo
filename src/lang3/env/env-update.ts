import * as Env from "../env"
import * as Value from "../value"

export function update(
  env: Env.Env,
  name: string,
  value: Value.Value
): Env.Env {
  env.set(name, value)
  return env
}
