import { Env } from "../env"
import { Value } from "../value"
import { Trace } from "../trace"
import * as Cores from "../cores"

type CtxEntry = {
  name: string
  t: Value
  value?: Value
}

export class Ctx {
  entries: Array<CtxEntry>

  constructor(entries: Array<CtxEntry> = new Array()) {
    this.entries = entries
  }

  names(): Array<string> {
    return Array.from(this.entries.map(({ name }) => name))
  }

  extend(name: string, t: Value, value?: Value): Ctx {
    return new Ctx([...this.entries, { name, t, value }])
  }

  lookup_type(name: string): undefined | Value {
    const names = this.names()
    const index = names.lastIndexOf(name)
    const entry = this.entries[index]
    if (index === -1) return undefined
    else return entry.t
  }

  to_env(): Env {
    let env = new Env()
    for (const { name, t, value } of this.entries) {
      if (value !== undefined) {
        env = env.extend(name, value)
      } else {
        env = env.extend(
          name,
          new Cores.NotYetValue(t, new Cores.VarNeutral(name))
        )
      }
    }
    return env
  }
}
