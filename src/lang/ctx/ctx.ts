import * as ut from "../../ut"
import { Env } from "../env"
import { ExpTrace } from "../errors"
import * as Exps from "../exps"
import { readback, Value } from "../value"
import { CtxEvent } from "./ctx-event"
import { CtxObserver, SimpleCtxObserver } from "./ctx-observer"
import { Highlighter, SimpleHighlighter } from "./highlighter"

export abstract class Ctx {
  abstract names: Array<string>
  abstract find_entry(name: string): undefined | { t: Value; value?: Value }
  abstract to_env(): Env

  static observers: Array<CtxObserver> = [
    SimpleCtxObserver.create({
      receive: (event) => {
        if (event.tag === "todo") {
          console.log(event.msg)
          console.log()
        }
      },
    }),
  ]

  static highlighter: Highlighter = new SimpleHighlighter({
    highlight: (tag, text) => {
      switch (tag) {
        case "code":
          return ut.colors.blue(text)
        case "warn":
          return ut.colors.red(text)
        case "note":
          return ut.colors.yellow(text)
        default:
          return text
      }
    },
  })

  static init(): EmptyCtx {
    return new EmptyCtx()
  }

  highlight(tag: string, text: string): string {
    return Ctx.highlighter.highlight(tag, text)
  }

  broadcast(event: CtxEvent): void {
    for (const observer of Ctx.observers) {
      observer.receive(event)
    }
  }

  freshen(name: string): string {
    return ut.freshen(new Set(this.names), name)
  }

  define(name: string, t: Value, value?: Value): Ctx {
    return new ExtendCtx({ name, t, value, rest: this })
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

    return this.define(name, t, value)
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
      const old_t_format = readback(this, new Exps.TypeValue(), old_t).format()
      const t_format = readback(this, new Exps.TypeValue(), t).format()
      throw new ExpTrace(
        [
          `I can not redefine name:`,
          `  ${name}`,
          `to a value of type:`,
          `  ${old_t_format}`,
          `It is already define to a value of type:`,
          `  ${t_format}`,
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

  find_entry(name: string): undefined | { t: Value; value?: Value } {
    if (name === this.name) {
      return { t: this.t, value: this.value }
    } else {
      return this.rest.find_entry(name)
    }
  }

  to_env(): Env {
    const value =
      this.value ||
      new Exps.NotYetValue(this.t, new Exps.VariableNeutral(this.name))

    return this.rest.to_env().extend(this.name, value)
  }
}

class EmptyCtx extends Ctx {
  names = []

  find_entry(name: string): undefined | { t: Value; value?: Value } {
    return undefined
  }

  to_env(): Env {
    return Env.init()
  }
}
