import * as Exp from "../exp"
import * as ut from "../../ut"

export interface Metadata {
  [key: string]: ut.Json
}

export interface Mod {
  map: Map<string, Exp.Exp>
  metadata: Metadata
}
