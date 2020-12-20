import { Evaluable } from "../../evaluable"
import { ZeroValue } from "../../exps/zero-value"

export const zero_evaluable = Evaluable({
  evaluability: (_) => ZeroValue,
})
