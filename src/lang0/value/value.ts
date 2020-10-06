import * as Exp from "../exp"
import * as Env from "../env"
import * as Neutral from "../neutral"

export type Value = fn | not_yet

interface fn {
  kind: "Value.fn"
  name: string
  ret: Exp.Exp
  env: Env.Env
}

export const fn = (name: string, ret: Exp.Exp, env: Env.Env): fn => ({
  kind: "Value.fn",
  name,
  ret,
  env,
})

interface not_yet {
  kind: "Value.not_yet"
  neutral: Neutral.Neutral
}

export const not_yet = (neutral: Neutral.Neutral): not_yet => ({
  kind: "Value.not_yet",
  neutral,
})
