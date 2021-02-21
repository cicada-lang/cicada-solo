import { Env } from "../env"
import * as Neutral from "../neutral"
import * as Value from "../value"

export class Ctx {
  entries: Map<string, { t: Value.Value; value?: Value.Value }>

  constructor(
    entries: Map<string, { t: Value.Value; value?: Value.Value }> = new Map()
  ) {
    this.entries = entries
  }

  static init(): Ctx {
    return new Ctx()
  }

  names(): Array<string> {
    return Array.from(this.entries.keys())
  }

  extend(name: string, t: Value.Value, value?: Value.Value): Ctx {
    return new Ctx(new Map([...this.entries, [name, { t, value }]]))
  }

  lookup(name: string): undefined | Value.Value {
    const entry = this.entries.get(name)
    if (entry !== undefined) {
      return entry.t
    } else {
      return undefined
    }
  }

  to_env(): Env {
    let env = Env.init()
    for (const [name, { t, value }] of this.entries) {
      if (value !== undefined) {
        env = env.extend(name, value)
      } else {
        env = env.extend(name, Value.not_yet(t, Neutral.v(name)))
      }
    }
    return env
  }
}
