import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Ctx from "../../ctx"
import { Checkable } from "../../checkable"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { readback } from "../../readback"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const same_checkable = Checkable({
  checkability: (t, { ctx }) => {
    const equal = Value.is_equal(ctx, t)
    if (!Value.conversion(ctx, equal.t, equal.from, equal.to)) {
      throw new Trace.Trace(
        ut.aline(`
          |I am expecting the following two values to be the same ${readback(
            ctx,
            Value.type,
            equal.t
          ).repr()}.
          |But they are not.
          |from:
          |  ${readback(ctx, equal.t, equal.from).repr()}
          |to:
          |  ${readback(ctx, equal.t, equal.to).repr()}
          |`)
      )
    }
  },
})
