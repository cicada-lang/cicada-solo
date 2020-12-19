import { Repr } from "../repr"
import { EtaExpander } from "../eta-expander"

export type Ty = Repr &
  Partial<EtaExpander> & {
    kind: string
  }
