import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"

export abstract class Exp {
  abstract evaluate(ctx: Ctx, env: Env): Value
  check?(ctx: Ctx, t: Value): void
  infer?(ctx: Ctx): Value
  abstract repr(): string
}
