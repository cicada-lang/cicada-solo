import { Repr } from "../repr"
import { EtaExpander } from "../eta-expander"

export type Ty = Repr &
  Partial<EtaExpander> & {
    kind: string
  }

import { Arrow } from "../tys/arrow"
import { Nat } from "../tys/nat"

export type nat = Nat
export const nat = Nat

export type arrow = Arrow
export const arrow = Arrow
