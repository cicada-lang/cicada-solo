import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export function quote_evaluable(str: string): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode }) => Value.quote(str),
  })
}
