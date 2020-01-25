import * as Exp from "./exp"
import * as Value from "./value"
import * as pretty from "./pretty"

export function equivalent(s: Value.Value, t: Value.Value): void {
  try {

  }

  catch (error) {
    throw error.prepend(
      "equivalent fail\n" +
        `s: ${pretty.pretty_value(s)}\n` +
        `t: ${pretty.pretty_value(t)}\n`)
  }
}
