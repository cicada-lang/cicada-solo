import { Checkable } from "../../checkable"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const zero_checkable = Checkable({
  checkability: (t, { ctx }) => {
    if (t.kind === "NatTy") {
      return
    }
    throw new Trace.Trace(
      ut.aline(`
        |When checking zero,
        |I am expecting the type to be NatTy,
        |but the given type is ${t.repr()}.
        |`)
    )
  },
})
