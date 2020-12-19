import { Ctx } from "../ctx"
import { Ty } from "../ty"

export type Checkable = {
  checkability: (t: Ty, the: { ctx: Ctx }) => void
}

export function Checkable(the: {
  checkability: (t: Ty, the: { ctx: Ctx }) => void
}): Checkable {
  return the
}
