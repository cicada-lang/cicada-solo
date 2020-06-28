import * as Ty from "../ty"
import * as Value from "../value"

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

export class Normal {
  constructor(public t: Ty.Ty, public value: Value.Value) {}
}
