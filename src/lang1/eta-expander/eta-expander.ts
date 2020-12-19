import { Value } from "../value"
import { Exp } from "../exp"

// NOTE for type directed readback

export type EtaExpander = {
  eta_expand: (value: Value, the: { used: Names }) => Exp
}

export type Names = Set<string>

export function EtaExpander(the: {
  eta_expand: (value: Value, the: { used: Names }) => Exp
}): EtaExpander {
  return the
}
