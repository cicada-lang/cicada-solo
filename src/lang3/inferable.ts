import { Mod } from "./mod"
import { Env } from "./env"
import { Ctx } from "./ctx"
import { Value } from "./value"

export type Inferable = {
  infer(the: { mod: Mod; ctx: Ctx; env: Env }): Value
}
