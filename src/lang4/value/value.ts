import { Referent } from "../referent"

export type Value = Partial<Referent> & {
  kind: string
}
