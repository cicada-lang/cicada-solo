import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { check } from "../../check"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const add1_checkable = (prev: Exp) =>
  Checkable({
    checkability: (t, { ctx }) => {
      if (t.kind === "Nat") {
        check(ctx, prev, t)
        return
      }
      throw new Trace.Trace(
        ut.aline(`
          |When checking add1,
          |I am expecting the type to be Nat,
          |but the given type is ${t.repr()}.
          |`)
      )
    },
  })
