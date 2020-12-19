import { Value } from "../value"
import { Exp } from "../exp"

// NOTE for type directed readback
export type EtaExpander = {
  eta_expander: (value: Value, the: { used: Names }) => Value
}

export type Names = Set<string>

export function EtaExpander(the: {
  eta_expander: (value: Value, the: { used: Names }) => Value
}): EtaExpander {
  return the
}
