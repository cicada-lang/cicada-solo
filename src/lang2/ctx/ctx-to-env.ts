import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Ty from "../ty"

export function to_env(ctx: Ctx.Ctx): Env.Env {
  const env = Env.init()
  for (const [name, { t, value }] of ctx) {
    if (value !== undefined) {
      Env.extend(env, name, value)
    } else {
      Env.extend(env, name, {
        kind: "Value.Reflection",
        t,
        neutral: { kind: "Neutral.Var", name },
      })
    }
  }
  return env
}
