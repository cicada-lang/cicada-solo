import nanoid from "nanoid"
import * as Value from "./value"
import * as Neutral from "./neutral"

export function unique_var_from(base: string): Neutral.Var {
  let uuid: string = nanoid()
  return new Neutral.Var(`${base}#${uuid}`)
}
