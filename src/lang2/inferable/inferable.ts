import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"

export type Inferable = {
  inferability: (the: { ctx: Ctx }) => Value
}

export function Inferable(the: {
  inferability: (the: { ctx: Ctx }) => Value
}): Inferable {
  return the
}
