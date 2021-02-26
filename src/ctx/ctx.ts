import { Env } from "../env"
import * as Neutral from "../neutral"
import { Value } from "../value"
import { NotYetValue } from "../core"
import { VarNeutral } from "../core"

export type CtxEntry = {
  t: Value
  value?: Value
}

export class Ctx {
  entries: Map<string, CtxEntry>

  constructor(entries: Map<string, CtxEntry> = new Map()) {
    this.entries = entries
  }

  names(): Array<string> {
    return Array.from(this.entries.keys())
  }

  extend(name: string, t: Value, value?: Value): Ctx {
    return new Ctx(new Map([...this.entries, [name, { t, value }]]))
  }

  lookup(name: string): undefined | Value {
    const entry = this.entries.get(name)
    if (entry !== undefined) {
      return entry.t
    } else {
      return undefined
    }
  }

  to_env(): Env {
    let env = new Env()
    for (const [name, { t, value }] of this.entries) {
      if (value !== undefined) {
        env = env.extend(name, value)
      } else {
        env = env.extend(name, new NotYetValue(t, new VarNeutral(name)))
      }
    }
    return env
  }
}
