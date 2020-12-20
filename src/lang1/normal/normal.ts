import { Ty } from "../ty"
import { Value } from "../value"
import { Exp } from "../exp"
import { Names } from "../readbackable"
import { readback } from "../readback"

// NOTE
// We need type in normal form,
// because each type can have its own equality
// (such as eta equivalence of function type),
// and normal form is defined as,
// the canonical representative of the equivalence class
// induced by the equality judgment,
// such that comparing normal forms for alpha-equivalence
// is sufficient to decide whether two expressions are equal.

// NOTE
// Normal form require equality,
// equality require type,
// thus normal form require type.

export type Normal = {
  t: Ty
  value: Value
  readback_normal: (used: Names) => Exp
}

export function Normal(t: Ty, value: Value): Normal {
  return {
    t,
    value,
    readback_normal: (used) => readback(used, t, value),
  }
}
