import { Exp } from "../exp"
import * as Value from "../value"
import { readback } from "../readback"
import * as Trace from "../trace"
import * as ut from "../ut"

export type Same = Exp & {
  kind: "Same"
}

export const Same: Same = {
  kind: "Same",
  evaluability: (_) => Value.same,
  checkability: (t, { ctx }) => {
    const equal = Value.is_equal(ctx, t)
    if (!Value.conversion(ctx, equal.t, equal.from, equal.to)) {
      throw new Trace.Trace(
        ut.aline(`
          |I am expecting the following two values to be the same type:
          |  ${readback(ctx, Value.type, equal.t).repr()}
          |But they are not.
          |from:
          |  ${readback(ctx, equal.t, equal.from).repr()}
          |to:
          |  ${readback(ctx, equal.t, equal.to).repr()}
          |`)
      )
    }
  },
  repr: () => "same",
  alpha_repr: () => "same",
}
