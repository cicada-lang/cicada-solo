import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"

export type AlphaReprOpts = {
  depth: number
  depths: Map<string, number>
}

export type Exp = {
  kind: string
  evaluability({ env }: { env: Env }): Value
  checkability?(t: Value, { ctx }: { ctx: Ctx }): void
  inferability?({ ctx }: { ctx: Ctx }): Value
  repr(): string
  alpha_repr(opts: AlphaReprOpts): string
}
