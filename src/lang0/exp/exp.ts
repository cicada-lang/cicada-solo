import { Evaluable } from "../evaluable"
import { Repr } from "../repr"

export type Exp = Evaluable &
  Repr & {
    kind: string
  }
