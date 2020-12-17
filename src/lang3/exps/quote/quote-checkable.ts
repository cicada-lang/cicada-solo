import { Checkable } from "../../checkable"
import * as Readback from "../../readback"
import * as Value from "../../value"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const quote_checkable = (str: string) =>
  Checkable({
    checkability: (t, { mod, ctx }) => {
      if (t.kind === "Value.type" || t.kind === "Value.str") return
      if (t.kind === "Value.quote" && str === t.str) return
      throw new Trace.Trace(
        ut.aline(`
          |The given value is string: "${str}",
          |But the given type is ${Readback.readback(
            mod,
            ctx,
            Value.type,
            t
          ).repr()}.
      |`)
      )
    },
  })
