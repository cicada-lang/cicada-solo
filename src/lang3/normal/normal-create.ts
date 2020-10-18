import * as Normal from "../normal"
import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function create(t: Value.Value, value: Value.Value): Normal.Normal {
  return { t, value }
}
