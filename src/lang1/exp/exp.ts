import { Evaluable } from "../evaluable"
import { Checkable } from "../checkable"
import { Inferable } from "../inferable"
import { Repr } from "../repr"

export type Exp = Evaluable &
  Checkable &
  Partial<Inferable> &
  Repr & {
    kind: string
  }
