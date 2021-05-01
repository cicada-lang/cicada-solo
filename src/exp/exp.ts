import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"

export abstract class Exp {
  abstract evaluate(env: Env): Value
  check?(ctx: Ctx, t: Value): void
  infer?(ctx: Ctx): Value
  abstract repr(): string
}
