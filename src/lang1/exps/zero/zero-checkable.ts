import { Checkable } from "../../checkable"
import * as Value from "../../value"
import * as Ty from "../../ty"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const zero_checkable = Checkable({
  checkability: (t, { ctx }) => {
    if (t.kind === "Ty.nat") {
      return
    }
    throw new Trace.Trace(
      ut.aline(`
        |When checking zero,
        |I am expecting the type to be Ty.nat,
        |but the given type is ${Ty.repr(t)}.
        |`)
    )
  },
})
