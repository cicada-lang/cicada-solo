import { Inferable } from "../../inferable"
import { check } from "../../check"
import { Exp } from "../../exp"
import * as Ty from "../../ty"

export const rec_inferable = (t: Ty.Ty, target: Exp, base: Exp, step: Exp) =>
  Inferable({
    inferability: ({ ctx }) => {
      // NOTE target should always be infered,
      // but it is simple to just check it here,
      // because we already know it should be `Ty.nat`.
      check(ctx, target, Ty.nat)
      check(ctx, base, t)
      check(ctx, step, Ty.arrow(Ty.nat, Ty.arrow(t, t)))
      return t
    },
  })
