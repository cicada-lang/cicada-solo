import { Env } from "../env"
import { Value } from "../value"

export type Evaluable = {
  evaluability(the: { env: Env }): Value
}

export function Evaluable(the: Evaluable): Evaluable {
  return the
}
