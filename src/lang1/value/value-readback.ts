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
  switch (t.kind) {
    case "Ty.Nat": {
      switch (value.kind) {
        case "Value.Zero": {
          return { kind: "Exp.Zero" }
        }
        case "Value.Succ": {
          return { kind: "Exp.Succ", prev: Value.readback(used, t, value.prev) }
        }
        default: {
          throw new Error("TODO")
        }
      }
    }
    case "Ty.Arrow": {
      const name = freshen(used, value_arg_name(value))
      const v: Value.Reflection = {
        kind: "Value.Reflection",
        t: t.arg,
        neutral: { kind: "Neutral.Var", name },
      }
      const ret = Exp.do_ap(value, v)
      const body = Value.readback(new Set([...used, name]), t.ret, ret)
      return { kind: "Exp.Fn", name, body }
    }
    default: {
      switch (value.kind) {
        case "Value.Reflection": {
          if (ut.equal(t, value.t)) {
            return Neutral.readback(used, value.neutral)
          } else {
            throw new Error("TODO")
          }
        }
        default: {
          throw new Error("TODO")
        }
      }
    }
  }
}

function value_arg_name(value: Value.Value): string {
  switch (value.kind) {
    case "Value.Fn": {
      return value.name
    }
    default: {
      // NOTE handle eta-expansion.
      return "x"
    }
  }
}
