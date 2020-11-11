import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Env from "../env"
import * as Neutral from "../neutral"

export type Value = not_yet | fn | zero | add1

type not_yet = {
  kind: "Value.not_yet"
  t: Ty.Ty
  neutral: Neutral.Neutral
}

export const not_yet = (t: Ty.Ty, neutral: Neutral.Neutral): not_yet => ({
  kind: "Value.not_yet",
  t,
  neutral,
})

type fn = {
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

type zero = {
  kind: "Value.zero"
}

export const zero: zero = {
  kind: "Value.zero",
}

type add1 = {
  kind: "Value.add1"
  prev: Value
}

export const add1 = (prev: Value): add1 => ({
  kind: "Value.add1",
  prev,
})
