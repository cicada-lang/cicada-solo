import { Value } from "../value"
import { Exp } from "../exp"
import { Names } from "../readbackable"

export function readback(used: Names, value: Value): Exp {
  return value.readbackability({ used })
}
