import * as Exp from "../exp"
import * as ut from "../../ut"

export type Metadata = {
  [key: string]: ut.Json
}

export type Mod = {
  map: Map<string, Exp.Exp>
  metadata: Metadata
}
