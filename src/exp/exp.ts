import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"
import { Inferable } from "../inferable"

export type AlphaReprOpts = {
  depth: number
  depths: Map<string, number>
}

export type Exp = {
  kind: string
  evaluability(the: { env: Env }): Value
  checkability(t: Value, the: { ctx: Ctx }): void
  repr(): string
  alpha_repr(opts: AlphaReprOpts): string
} & Partial<Inferable>
