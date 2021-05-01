import { Ctx } from "../ctx"
import { Core } from "../core"
import { Value } from "../value"

export abstract class Exp {
  check?(ctx: Ctx, t: Value): Core
  infer?(ctx: Ctx): { t: Value; core: Core }
  abstract repr(): string
}
