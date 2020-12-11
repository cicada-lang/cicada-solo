import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Check from "../../check"

export const union_inferable = (left: Exp, right: Exp) =>
  Inferable({
    inferability: ({ mod, ctx }) => {
      Check.check(mod, ctx, left, Value.type)
      Check.check(mod, ctx, right, Value.type)
      return Value.type
    },
  })
