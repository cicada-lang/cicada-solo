import * as Env from "../env"

export function clone(env: Env.Env): Env.Env {
  return new Map([...env])
}
