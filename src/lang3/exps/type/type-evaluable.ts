import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export const type_evaluable = Evaluable({
  evaluability: ({ mod, env, mode }) => Value.type,
})
