import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"

export type Checkable = {
  checkability(t: Value, the: { ctx: Ctx }): void
}

export function Checkable(the: {
  checkability(t: Value, the: { ctx: Ctx }): void
}): Checkable {
  return the
}
