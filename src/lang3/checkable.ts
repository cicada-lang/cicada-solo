import { Mod } from "./mod"
import { Env } from "./env"
import { Ctx } from "./ctx"
import { Value } from "./value"

export type Checkable = {
  check(t: Value, the: { mod: Mod; ctx: Ctx; env: Env }): void
}
