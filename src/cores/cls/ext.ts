import { Core, AlphaCtx } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Telescope } from "../../telescope"
import { evaluate } from "../../evaluate"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Ext extends Core {
  name?: string
  parent_name: string
  entries: Array<{ name: string; t: Core; exp?: Core }>

  constructor(
    parent_name: string,
    entries: Array<{ name: string; t: Core; exp?: Core }>,
    opts?: { name?: string }
  ) {
    super()
    this.parent_name = parent_name
    this.entries = entries
    this.name = opts?.name
  }

  evaluate(ctx: Ctx, env: Env): Value {
    const parent = evaluate(ctx, env, new Cores.Var(this.parent_name))
    if (parent instanceof Cores.ClsValue) {
      return new Cores.ExtValue([
        { name: parent.name, telescope: parent.telescope },
        { name: this.name, telescope: new Telescope(ctx, env, this.entries) },
      ])
    }
    if (parent instanceof Cores.ExtValue) {
      return new Cores.ExtValue([
        ...parent.entries,
        { name: this.name, telescope: new Telescope(ctx, env, this.entries) },
      ])
    }
    throw new Trace(`Coreecting parent to be ClsValue or ExtValue`)
  }

  repr(): string {
    const name = this.name ? `${this.name} ` : ""

    if (this.entries.length === 0) {
      return name + "[]"
    }

    const entries = this.entries.map(({ name, t, exp }) => {
      return exp
        ? `${name}: ${t.repr()} = ${exp.repr()}`
        : `${name}: ${t.repr()}`
    })

    const s = entries.join("\n")

    return (
      name + `@extends ${this.parent_name} ` + `[\n${ut.indent(s, "  ")}\n]`
    )
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Trace(
      `ExtValue should be readback to Cls,\n` +
        `thus ExtValue.alpha_repr should never be called.`
    )
  }
}
