import * as Exp from "../exp"

export interface Metadata {
  [key: string]: any
}

export interface Mod {
  map: Map<string, Exp.Exp>
  metadata: Metadata
}
