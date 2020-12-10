import { Evaluable, EvaluationMode } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Readback from "../../readback"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export function quote_checkable(str: string): Checkable {
  return Checkable({
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
}
