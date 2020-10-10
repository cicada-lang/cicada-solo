import * as Exp from "../exp"
import * as Value from "../value"

export interface Telescope {
  env: Map<string, Value.Value>
  next: undefined | { name: string; t: Value.Value }
  scope: Array<{ name: string; t: Exp.Exp }>
}
