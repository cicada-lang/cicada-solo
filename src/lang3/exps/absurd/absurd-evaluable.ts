import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export const absurd_evaluable = Evaluable({
  evaluability: ({ mod, env, mode }) => Value.absurd,
})
