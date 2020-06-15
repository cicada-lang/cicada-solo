import * as Env from "../env"
import * as Value from "../value"

export function clone(env: Env.Env): Env.Env {
  return new Map(env)
}
