import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export const zero_evaluable = Evaluable({
  evaluability: ({ env }) => Value.zero
})
