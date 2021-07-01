import { Env } from "../env"
import { Value } from "../value"
import { Trace } from "../errors"
import { readback } from "../value"
import * as Sem from "../sem"

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

  get names(): Array<string> {
    return Array.from(this.entries.map(({ name }) => name))
  }

  extend(name: string, t: Value, value?: Value): Ctx {
    if (this.names.includes(name)) {
      throw new Trace(
        [
          `The names in ctx must be distinct.`,
          `But I found duplicated name:`,
          `  ${name}`,
          `existing names:`,
          `  ${this.names.join(", ")}`,
        ].join("\n") + "\n"
      )
    }

    return new Ctx([...this.entries, { name, t, value }])
  }

  lookup_type(name: string): undefined | Value {
    const index = this.names.lastIndexOf(name)
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
        env = env.extend(name, new Sem.NotYetValue(t, new Sem.VarNeutral(name)))
      }
    }
    return env
  }

  assert_not_redefine(name: string, t: Value, value?: Value): void {
    const old_t = this.lookup_type(name)
    if (old_t) {
      const old_t_repr = readback(this, new Sem.TypeValue(), old_t).repr()
      const t_repr = readback(this, new Sem.TypeValue(), t).repr()
      throw new Trace(
        [
          `I can not redefine name:`,
          `  ${name}`,
          `to a value of type:`,
          `  ${old_t_repr}`,
          `It is already define to a value of type:`,
          `  ${t_repr}`,
        ].join("\n")
      )
    }
  }
}
