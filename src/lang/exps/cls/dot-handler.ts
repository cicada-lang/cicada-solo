import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"

export abstract class DotHandler {
  abstract get(field: string): Value
}
