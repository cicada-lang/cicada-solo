import { Checkable } from "../../checkable"
import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import { check } from "../../check"
import * as Ty from "../../ty"
import * as Value from "../../value"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const add1_checkable = (prev: Exp) =>
  Checkable({
    checkability: (t, { ctx }) => {
      if (t.kind === "Ty.nat") {
        check(ctx, prev, t)
        return
      }
      throw new Trace.Trace(
        ut.aline(`
          |When checking add1,
          |I am expecting the type to be Ty.nat,
          |but the given type is ${Ty.repr(t)}.
          |`)
      )
    },
  })
