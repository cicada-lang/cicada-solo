import { Env } from "../env"
import { Value } from "../value"
import { Checkable } from "../checkable"
import { Inferable } from "../inferable"

export type AlphaReprOpts = {
  depth: number
  depths: Map<string, number>
}

export type Exp = {
  kind: string
  evaluability(the: { env: Env }): Value
  repr(): string
  alpha_repr(opts: AlphaReprOpts): string
} & Checkable &
  Partial<Inferable>
