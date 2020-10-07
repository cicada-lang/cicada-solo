import * as Exp from "../exp"
import * as Value from "../value"

export interface Telescope {
  env: Map<string, Value.Value>
  sat: Array<{ name: string; t: Value.Value; value: Value.Value }>
  next: undefined | { name: string; t: Value.Value }
  queue: Array<{ name: string; exp: Exp.Exp }>
}
