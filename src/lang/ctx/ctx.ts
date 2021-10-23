import { Env } from "../env"
import { Value } from "../value"
import { ExpTrace } from "../errors"
import { readback } from "../value"
import * as Exps from "../exps"
import * as ut from "../../ut"

export type CtxEvent = { tag: string; msg: string }

export abstract class CtxObserver {
  abstract receive(event: CtxEvent): void
}

export class SimpleCtxObserver extends CtxObserver {
  receive: (event: CtxEvent) => void

  constructor(opts: { receive: (event: CtxEvent) => void }) {
    super()
    this.receive = opts.receive
  }
}

export type CtxOptions = {
  observers: Array<CtxObserver>
}

export abstract class Ctx {
  abstract names: Array<string>
  abstract find_entry(name: string): undefined | { t: Value; value?: Value }
  abstract to_env(): Env

  observers: Array<CtxObserver>

  constructor(opts: CtxOptions) {
    this.observers = opts.observers
  }

  static init(opts: CtxOptions): EmptyCtx {
    return new EmptyCtx(opts)
  }

  broadcast(event: CtxEvent): void {
    for (const observer of this.observers) {
      observer.receive(event)
    }
  }

  narration(lines: Array<string>): void {
    const story = lines.join("\n")
    this.broadcast({ tag: "narration", msg: story })
  }

  freshen(name: string): string {
    return ut.freshen(new Set(this.names), name)
  }

  extend(name: string, t: Value, value?: Value): Ctx {
    if (this.names.includes(name)) {
      throw new ExpTrace(
        [
          `The names in ctx must be distinct.`,
          `But I found duplicated name:`,
          `  ${name}`,
          `existing names:`,
          `  ${this.names.join(", ")}`,
        ].join("\n") + "\n"
      )
    }

    return new ExtendCtx({
      name,
      t,
      value,
      rest: this,
      observers: this.observers,
    })
  }

  find_type(name: string): undefined | Value {
    const entry = this.find_entry(name)
    if (entry) {
      return entry.t
    } else {
      return undefined
    }
  }

  assert_not_redefine(name: string, t: Value, value?: Value): void {
    const old_t = this.find_type(name)
    if (old_t) {
      const old_t_repr = readback(this, new Exps.TypeValue(), old_t).repr()
      const t_repr = readback(this, new Exps.TypeValue(), t).repr()
      throw new ExpTrace(
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

class ExtendCtx extends Ctx {
  name: string
  t: Value
  value?: Value
  rest: Ctx

  constructor(opts: {
    name: string
    t: Value
    value?: Value
    rest: Ctx
    observers: Array<CtxObserver>
  }) {
    super(opts)
    this.name = opts.name
    this.t = opts.t
    this.value = opts.value
    this.rest = opts.rest
  }

  get names(): Array<string> {
    return [this.name, ...this.rest.names]
  }

  find_entry(name: string): undefined | { t: Value; value?: Value } {
    if (name === this.name) {
      return { t: this.t, value: this.value }
    } else {
      return this.rest.find_entry(name)
    }
  }

  to_env(): Env {
    const value =
      this.value || new Exps.NotYetValue(this.t, new Exps.VarNeutral(this.name))

    return this.rest.to_env().extend(this.name, value)
  }
}

class EmptyCtx extends Ctx {
  constructor(opts: CtxOptions) {
    super(opts)
  }

  names = []

  find_entry(name: string): undefined | { t: Value; value?: Value } {
    return undefined
  }

  to_env(): Env {
    return Env.init()
  }
}
