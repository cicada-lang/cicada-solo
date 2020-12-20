import { Ty } from "../ty"
import * as Exp from "../exp"
import * as Value from "../value"
import * as ut from "../../ut"

// NOTE
// The typed version of the readback procedure
// takes the types into account to perform eta-expansion.

type Names = Set<string>

export function readback(used: Names, t: Ty, value: Value.Value): Exp.Exp {
  if (t.eta_expand) {
    return t.eta_expand(value, { used })
  }

  if (value.readbackability) {
    return value.readbackability(t, { used })
  }

  throw new Error(
    ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`)
  )
}
