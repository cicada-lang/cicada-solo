import * as Ctx from "../ctx"
import { Env } from "../env"
import * as Value from "../value"
import * as Neutral from "../neutral"

export function to_env(ctx: Ctx.Ctx): Env {
  let env = Env.init()
  for (const [name, { t, value }] of ctx) {
    if (value !== undefined) {
      env = env.extend(name, value)
    } else {
      env = env.extend(name, Value.not_yet(t, Neutral.v(name)))
    }
  }
  return env
}
