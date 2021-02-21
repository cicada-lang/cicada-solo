import { Env } from "../env"
import { Value } from "../value"
import { Checkable } from "../checkable"
import { Inferable } from "../inferable"
import { Repr } from "../repr"
import { AlphaRepr } from "../alpha-repr"

export type Exp = {
  kind: string
  evaluability(the: { env: Env }): Value
} & Checkable &
  Partial<Inferable> &
  Repr &
  AlphaRepr
