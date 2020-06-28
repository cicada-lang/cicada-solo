import { freshen } from "./freshen"
import * as Neutral from "../neutral"
import * as Value from "../value"
import * as Exp from "../exp"

export function readback(used: Set<string>, value: Value.Value): Exp.Exp {
  switch (value.kind) {
    case "Value.Reflection": {
      return Neutral.readback(used, value.neutral)
    }
    case "Value.Fn": {
      const name = freshen(used, value.name)
      const v: Value.Reflection = {
        kind: "Value.Reflection",
        neutral: { kind: "Neutral.Var", name },
      }
      const ret = Exp.do_ap(value, v)
      const body = readback(new Set([...used, name]), ret)
      return { kind: "Exp.Fn", name, body }
    }
  }
}
