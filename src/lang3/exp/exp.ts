import { Evaluable } from "../evaluable"
import { Checkable } from "../checkable"
import { Inferable } from "../inferable"
import { Repr } from "../repr"
import { AlphaRepr } from "../alpha-repr"

export type Exp = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
    kind: string
  }
