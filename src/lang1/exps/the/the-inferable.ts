import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import { check } from "../../check"
import * as Ty from "../../ty"

export const the_inferable = (t: Ty.Ty, exp: Exp) =>
  Inferable({
    inferability: ({ ctx }) => {
      check(ctx, exp, t)
      return t
    },
  })
