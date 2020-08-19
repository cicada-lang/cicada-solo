import { freshen } from "./freshen"
import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as ut from "../../ut"

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
    return Exp.add1(Value.readback(used, t, value.prev))
  } else if (t.kind === "Ty.arrow") {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.
    const name = freshen(used, value_arg_name(value))
    const variable = Value.reflection(t.arg_t, Neutral.v(name))
    const ret = Exp.do_ap(value, variable)
    const body = Value.readback(new Set([...used, name]), t.ret_t, ret)
    return Exp.fn(name, body)
  } else if (value.kind === "Value.reflection") {
    if (ut.equal(t, value.t)) {
      return Neutral.readback(used, value.neutral)
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
