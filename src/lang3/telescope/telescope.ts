import * as Exp from "../exp"
import * as Value from "../value"

export interface Telescope {
  env: Map<string, Value.Value>
  satisfied: Map<string, { t: Value.Value; value: Value.Value }>
  next?: { name: string; t: Value.Value }
  queue: Array<{ name: string; exp: Exp.Exp }>
}
