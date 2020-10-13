import * as Exp from "../exp"

export interface Mod {
  map: Map<string, { t?: Exp.Exp; exp: Exp.Exp }>
}
