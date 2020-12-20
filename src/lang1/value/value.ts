import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Env from "../env"
import * as Neutral from "../neutral"

import { FnValue } from "../exps/fn-value"
import { ZeroValue } from "../exps/zero-value"

export type Value = not_yet | FnValue | ZeroValue | add1

export type not_yet = {
  kind: "Value.not_yet"
  t: Ty.Ty
  neutral: Neutral.Neutral
}

export const not_yet = (t: Ty.Ty, neutral: Neutral.Neutral): not_yet => ({
  kind: "Value.not_yet",
  t,
  neutral,
})

export type fn = FnValue
export const fn = FnValue

export type zero = ZeroValue
export const zero = ZeroValue

export type add1 = {
  kind: "Value.add1"
  prev: Value
}

export const add1 = (prev: Value): add1 => ({
  kind: "Value.add1",
  prev,
})
