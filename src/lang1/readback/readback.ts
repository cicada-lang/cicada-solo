import * as Readback from "../readback"
import * as Evaluate from "../evaluate"
import { Ty } from "../ty"
import * as Exp from "../exp"
import { Add1, Zero } from "../exps"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as ut from "../../ut"
import { do_ap } from "../exps/ap"

// NOTE
// The typed version of the readback procedure
// takes the types into account to perform eta-expansion.

type Names = Set<string>

export function readback(used: Names, t: Ty, value: Value.Value): Exp.Exp {
  if (t.eta_expand) {
    return t.eta_expand(value, { used })
  }

  if (t.kind === "Ty.nat" && value.kind === "Value.zero") {
    return Zero
  }

  if (t.kind === "Ty.nat" && value.kind === "Value.add1") {
    return Add1(Readback.readback(used, t, value.prev))
  }

  if (value.kind === "Value.not_yet") {
    if (ut.equal(t, value.t)) {
      return Readback.readback_neutral(used, value.neutral)
    }
    throw new Error(
      ut.aline(`
        |When trying to readback a annotated value: ${ut.inspect(value)},
        |the annotated type is: ${value.t.repr()},
        |but the given type is ${t.repr()}.
        |`)
    )
  }

  throw new Error(
    ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`)
  )
}
