import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export const same_evaluable = Evaluable({
  evaluability: ({ mod, env, mode }) => Value.same,
})
