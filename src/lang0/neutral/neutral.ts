import { VarNeutral } from "../exps/var-neutral"

export type Neutral = VarNeutral | ap

import * as Value from "../value"

export type v = VarNeutral
export const v = VarNeutral

type ap = {
  kind: "Neutral.ap"
  target: Neutral
  arg: Value.Value
}

export const ap = (target: Neutral, arg: Value.Value): ap => ({
  kind: "Neutral.ap",
  target,
  arg,
})
