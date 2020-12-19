import { Value } from "../value"
import { Env } from "../env"

export type Evaluable = {
  evaluability: (the: { env: Env }) => Value
}

export function Evaluable(the: {
  evaluability: (the: { env: Env }) => Value
}): Evaluable {
  return the
}
