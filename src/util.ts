import nanoid from "nanoid"
import * as Value from "./value"

export function unique_var_from(base: string): Value.Neutral.Var {
  let uuid: string = nanoid()
  return new Value.Neutral.Var(`${base}#${uuid}`)
}
