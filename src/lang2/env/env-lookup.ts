import * as Env from "../env"
import * as Value from "../value"

export function lookup(env: Env.Env, name: string): undefined | Value.Value {
  return env.get(name)
}
