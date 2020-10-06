import * as Neutral from "../neutral"
import * as Value from "../value"
import * as Exp from "../exp"
import * as ut from "../../ut"

export function readback(used: Set<string>, value: Value.Value): Exp.Exp {
  switch (value.kind) {
    case "Value.not_yet": {
      return Neutral.readback(used, value.neutral)
    }
    case "Value.fn": {
      const name = ut.freshen_name(used, value.name)
      const v = Value.not_yet(Neutral.v(name))
      const ret = Exp.do_ap(value, v)
      return Exp.fn(name, readback(new Set([...used, name]), ret))
    }
  }
}
