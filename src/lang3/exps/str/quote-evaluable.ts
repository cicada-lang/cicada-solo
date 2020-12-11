import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export const quote_evaluable = (str: string) =>
  Evaluable({
    evaluability: ({ mod, env, mode }) => Value.quote(str),
  })
