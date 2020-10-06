import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Value from "../value"
import * as Neutral from "../neutral"

export function to_env(ctx: Ctx.Ctx): Env.Env {
  const env = Env.init()
  for (const [name, { t, value }] of ctx) {
    if (value !== undefined) {
      Env.update(env, name, value)
    } else {
      Env.update(env, name, Value.not_yet(t, Neutral.v(name)))
    }
  }
  return env
}
