import { Env } from "../env"
import { Ctx } from "../ctx"
import * as Value from "../value"

export type AlphaReprOpts = {
  depth: number
  depths: Map<string, number>
}

export type Exp = {
  kind: string
  evaluability(the: { env: Env }): Value.Value
  checkability(t: Value.Value, the: { ctx: Ctx }): void
  inferability?(the: { ctx: Ctx }): Value.Value
  repr(): string
  alpha_repr(opts: AlphaReprOpts): string
}
