import * as Readback from "../readback"
import * as Evaluate from "../evaluate"
import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as ut from "../../ut"
import { do_ap } from "../exps/ap"

// NOTE
// The typed version of the readback procedure
// takes the types into account to perform eta-expansion.

export function readback(
  used: Set<string>,
  t: Ty.Ty,
  value: Value.Value
): Exp.Exp {
  if (t.kind === "Ty.nat" && value.kind === "Value.zero") {
    return Exp.zero
  } else if (t.kind === "Ty.nat" && value.kind === "Value.add1") {
    return Exp.add1(Readback.readback(used, t, value.prev))
  } else if (t.kind === "Ty.arrow") {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.
    const name = ut.freshen_name(used, value_arg_name(value))
    const variable = Value.not_yet(t.arg_t, Neutral.v(name))
    const ret = do_ap(value, variable)
    return Exp.fn(
      name,
      Readback.readback(new Set([...used, name]), t.ret_t, ret)
    )
  } else if (value.kind === "Value.not_yet") {
    if (ut.equal(t, value.t)) {
      return Readback.readback_neutral(used, value.neutral)
    } else {
      throw new Error(
        ut.aline(`
        |When trying to readback a annotated value: ${ut.inspect(value)},
        |the annotated type is: ${Ty.repr(value.t)},
        |but the given type is ${Ty.repr(t)}.
        |`)
      )
    }
  } else {
    throw new Error(
      ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`)
    )
  }
}

function value_arg_name(value: Value.Value): string {
  return value.kind === "Value.fn" ? value.name : "x"
}
