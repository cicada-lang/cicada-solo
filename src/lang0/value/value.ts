import * as Exp from "../exp"
import * as Env from "../env"
import * as Neutral from "../neutral"

export type Value = fn | reflection

interface fn {
  kind: "Value.fn"
  name: string
  body: Exp.Exp
  env: Env.Env
}

export const fn = (name: string, body: Exp.Exp, env: Env.Env): fn => ({
  kind: "Value.fn",
  name,
  body,
  env,
})

interface reflection {
  kind: "Value.reflection"
  neutral: Neutral.Neutral
}

export const reflection = (neutral: Neutral.Neutral): reflection => ({
  kind: "Value.reflection",
  neutral,
})
