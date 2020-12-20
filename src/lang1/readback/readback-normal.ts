import * as Readback from "../readback"
import * as Exp from "../exp"
import * as Normal from "../normal"

export function readback_normal(
  used: Set<string>,
  normal: Normal.Normal
): Exp.Exp {
  return Readback.readback(used, normal.t, normal.value)
}
