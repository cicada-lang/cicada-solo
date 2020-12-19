import { Env } from "../env"
import { Ctx } from "../ctx"
import { Ty } from "../ty"

export type Inferable = {
  inferability: (t: Ty, the: { ctx: Ctx }) => Ty
}

export function Inferable(the: {
  inferability: (t: Ty, the: { ctx: Ctx }) => Ty
}): Inferable {
  return the
}
