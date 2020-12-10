import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export const str_evaluable = Evaluable({
  evaluability: ({ mod, env, mode }) => Value.str,
})
