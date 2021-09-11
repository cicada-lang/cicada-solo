import { Env } from "../env"
import { Value } from "../value"
import { Trace } from "../errors"
import { readback } from "../value"
import * as Exps from "../exps"

type CtxEntry = { name: string; t: Value; value?: Value }

export abstract class Ctx {
  abstract names: Array<string>
  abstract lookup_entry(name: string): undefined | { t: Value; value?: Value }
  abstract to_env(): Env

  static get null(): NullCtx {
    return new NullCtx()
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

    return new ConsCtx({ name, t, value, rest: this })
  }

  lookup_type(name: string): undefined | Value {
    const entry = this.lookup_entry(name)
    if (entry) {
      return entry.t
    } else {
      return undefined
    }
  }

  assert_not_redefine(name: string, t: Value, value?: Value): void {
    const old_t = this.lookup_type(name)
    if (old_t) {
      const old_t_repr = readback(this, new Exps.TypeValue(), old_t).repr()
      const t_repr = readback(this, new Exps.TypeValue(), t).repr()
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

class ConsCtx extends Ctx {
  name: string
  t: Value
  value?: Value
  rest: Ctx

  constructor(opts: { name: string; t: Value; value?: Value; rest: Ctx }) {
    super()
    this.name = opts.name
    this.t = opts.t
    this.value = opts.value
    this.rest = opts.rest
  }

  get names(): Array<string> {
    return [this.name, ...this.rest.names]
  }

  lookup_entry(name: string): undefined | { t: Value; value?: Value } {
    if (name === this.name) {
      return { t: this.t, value: this.value }
    } else {
      return this.rest.lookup_entry(name)
    }
  }

  to_env(): Env {
    const value =
      this.value || new Exps.NotYetValue(this.t, new Exps.VarNeutral(this.name))

    return this.rest.to_env().extend(this.name, value)
  }
}

class NullCtx extends Ctx {
  names = []

  lookup_entry(name: string): undefined | { t: Value; value?: Value } {
    return undefined
  }

  to_env(): Env {
    return Env.empty
  }
}
