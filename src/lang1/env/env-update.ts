import * as Env from "../env"
import * as Value from "../value"

// NOTE side effect API,
//   one needs to clone the env as needed.
export function update(
  env: Env.Env,
  name: string,
  value: Value.Value
): Env.Env {
  env.set(name, value)
  return env
}
