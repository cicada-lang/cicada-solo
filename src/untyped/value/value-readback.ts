import { freshen } from "./freshen"
import * as Neutral from "../neutral"
import * as Value from "../value"
import * as Exp from "../exp"

export function readback(used: Set<string>, value: Value.Value): Exp.Exp {
  switch (value.kind) {
    case "Value.Neutral": {
      return Neutral.readback(used, value.neutral)
    }
    case "Value.Fn": {
      const name = freshen(used, value.name)
      const body = Exp.do_ap(value, {
        kind: "Value.Neutral",
        neutral: {
          kind: "Neutral.Var",
          name,
        },
      })
      return {
        kind: "Exp.Fn",
        name,
        body: readback(new Set([...used, name]), body),
      }
    }
  }
}
