import { Referent } from "../referent"
import { Repr } from "../repr"

export type Value = Partial<Referent> & Repr & {
  kind: string
}
