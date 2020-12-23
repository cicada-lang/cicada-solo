import { FnValue } from "../exps/fn-value"

export type Value = Fn | not_yet

import * as Exp from "../exp"
import * as Env from "../env"
import * as Neutral from "../neutral"

export type fn = FnValue
export const fn = FnValue

export type not_yet = {
  kind: "Value.not_yet"
  neutral: Neutral.Neutral
}

export const not_yet = (neutral: Neutral.Neutral): not_yet => ({
  kind: "Value.not_yet",
  neutral,
})
