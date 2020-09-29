import * as Mod from "../mod"
import * as Exp from "../exp"
import * as Value from "../value"

export function dot(mod: Mod.Mod, name: string): Value.Value {
  const env = new Map()
  const values = Exp.evaluate(mod, env, Exp.v(name))
  if (values.length !== 1) {
    throw new Error(
      `The values.length should be 1, instead of: ${values.length}.`
    )
  }
  return values[0]
}
