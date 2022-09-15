import { colors } from "../../utils/colors"
import { freshen } from "../../utils/freshen"
import { Env } from "../env"
import { ElaborationError } from "../errors"
import * as Exps from "../exps"
import { readback, Value } from "../value"
import { CtxEvent, CtxObserver } from "./ctx-observer"
import { Highlighter } from "./highlighter"

export abstract class Ctx {
  abstract names: Array<string>
  abstract findEntry(name: string): undefined | { t: Value; value?: Value }
  abstract remove(name: string): Ctx
  abstract toEnv(): Env

  static observers: Array<CtxObserver> = [
    {
      receive: (event) => {
        if (event.tag === "todo") {
          console.log(event.msg)
          console.log()
        }
      },
    },
  ]

  static highlighter: Highlighter = {
    highlight: (tag, text) => {
      switch (tag) {
        case "code":
          return colors.blue(text)
        case "warn":
          return colors.red(text)
        case "note":
          return colors.yellow(text)
        default:
          return text
      }
    },
  }

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
    return freshen(new Set(this.names), name)
  }

  define(name: string, t: Value, value?: Value): Ctx {
    return new ExtendCtx(name, t, value, this)
  }

  extend(name: string, t: Value, value?: Value): Ctx {
    if (this.names.includes(name)) {
      throw new ElaborationError(
        [
          `The names in ctx must be distinct.`,
          `But I found duplicated name:`,
          `  ${name}`,
          `existing names:`,
          `  ${this.names.join(", ")}`,
        ].join("\n") + "\n",
      )
    }

    return this.define(name, t, value)
  }

  findType(name: string): undefined | Value {
    const entry = this.findEntry(name)
    if (entry) {
      return entry.t
    } else {
      return undefined
    }
  }

  assertNotRedefine(name: string, t: Value, value: Value): void {
    const old_t = this.findType(name)
    if (old_t === undefined) return

    const old_t_format = readback(this, new Exps.TypeValue(), old_t).format()
    const t_format = readback(this, new Exps.TypeValue(), t).format()
    const value_format = readback(this, t, value).format()
    throw new ElaborationError(
      [
        `I can not redefine name:`,
        `  ${name}`,
        `to a value of type:`,
        `  ${old_t_format}`,
        `It is already defined to a value of type:`,
        `  ${t_format}`,
        `and the value is:`,
        `  ${value_format}`,
      ].join("\n"),
    )
  }
}

class ExtendCtx extends Ctx {
  constructor(
    public name: string,
    public t: Value,
    public value: Value | undefined,
    public rest: Ctx,
  ) {
    super()
  }

  get names(): Array<string> {
    return [this.name, ...this.rest.names]
  }

  findEntry(name: string): undefined | { t: Value; value?: Value } {
    if (name === this.name) {
      return { t: this.t, value: this.value }
    } else {
      return this.rest.findEntry(name)
    }
  }

  remove(name: string): Ctx {
    if (name === this.name) {
      return this.rest
    } else {
      return new ExtendCtx(
        this.name,
        this.t,
        this.value,
        this.rest.remove(name),
      )
    }
  }

  toEnv(): Env {
    const value =
      this.value || new Exps.NotYetValue(this.t, new Exps.VarNeutral(this.name))

    return this.rest.toEnv().extend(this.name, value)
  }
}

class EmptyCtx extends Ctx {
  names = []

  findEntry(name: string): undefined | { t: Value; value?: Value } {
    return undefined
  }

  remove(name: string): Ctx {
    return this
  }

  toEnv(): Env {
    return Env.init()
  }
}
