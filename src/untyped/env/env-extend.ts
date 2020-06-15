import * as Env from "../env"
import * as Value from "../value"

// NOTE side effect API, one need to clone the env as needed.
export function extend(env: Env.Env, name: string, value: Value.Value): void {
  env.set(name, value)
}
