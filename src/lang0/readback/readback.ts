import * as Readback from "../readback"
import * as Evaluate from "../evaluate"
import * as Neutral from "../neutral"
import * as Value from "../value"
import * as Exp from "../exp"
import * as ut from "../../ut"
import { Fn } from "../exps"

export function readback(used: Set<string>, value: Value.Value): Exp.Exp {
  switch (value.kind) {
    case "Value.not_yet": {
      return value.neutral.readback_neutral({ used })
    }
    case "Value.fn": {
      const name = ut.freshen_name(used, value.name)
      const v = Value.not_yet(Neutral.v(name))
      const ret = Evaluate.do_ap(value, v)
      return Fn(name, Readback.readback(new Set([...used, name]), ret))
    }
  }
}
