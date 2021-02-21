import { Env } from "../env"
import { Value } from "../value"
import { Checkable } from "../checkable"
import { Inferable } from "../inferable"
import { AlphaRepr } from "../alpha-repr"

export type Exp = {
  kind: string
  evaluability(the: { env: Env }): Value
  repr(): string
} & Checkable &
  Partial<Inferable> &
  AlphaRepr
