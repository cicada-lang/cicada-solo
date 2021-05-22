import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { readback } from "../../readback"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { conversion } from "../../conversion"
import { Trace } from "../../trace"
import * as Cores from "../../cores"
import * as ut from "../../ut"

export class Fulfilled {
  entries: Array<{ name: string; t: Value; value: Value }>

  constructor(
    entries: Array<{ name: string; t: Value; value: Value }> = new Array()
  ) {
    this.entries = entries
  }

  fill_entry(name: string, t: Value, value: Value): Fulfilled {
    return new Fulfilled([...this.entries, { name, t, value }])
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    const cores: Map<string, Core> = new Map()

    for (const { name, t, value } of this.entries) {
      const found = properties.get(name)

      if (found === undefined) {
        throw new Trace(
          ut.aline(`
            |Can not found satisfied entry name: ${name}
            |`)
        )
      }

      const core = check(ctx, found, t)
      cores.set(name, core)
      const found_value = evaluate(ctx.to_env(), core)

      if (!conversion(ctx, t, value, found_value)) {
        const t_repr = readback(ctx, new Cores.TypeValue(), t).repr()
        const value_repr = readback(ctx, t, value).repr()
        const found_repr = readback(ctx, t, found_value).repr()
        throw new Trace(
          ut.aline(`
          |I am expecting the following two values to be the same ${t_repr}.
          |But they are not.
          |The value in object:
          |  ${value_repr}
          |The value in partially filled class:
          |  ${found_repr}
          |`)
        )
      }
    }

    return cores
  }

  readback_aux(
    ctx: Ctx,
    t: Value
  ): { entries: Array<{ name: string; t: Core; exp?: Core }>; ctx: Ctx } {
    const entries: Array<{ name: string; t: Core; exp?: Core }> = []

    for (const { name, t, value } of this.entries) {
      const t_exp = readback(ctx, new Cores.TypeValue(), t)
      const exp = readback(ctx, t, value)
      entries.push({ name, t: t_exp, exp })
      ctx = ctx.extend(name, t, value)
    }

    return { entries, ctx }
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core> {
    const properties = new Map()

    for (const entry of this.entries) {
      const property_value = Cores.Dot.apply(value, entry.name)
      if (!conversion(ctx, entry.t, property_value, entry.value)) {
        throw new Trace(
          "property_value not equivalent to the fulfilled entry value"
        )
      }
      const property_exp = readback(ctx, entry.t, property_value)
      properties.set(entry.name, property_exp)
    }

    return properties
  }

  dot_type(target: Value, name: string): undefined | Value {
    for (const entry of this.entries) {
      if (entry.name === name) {
        return entry.t
      }
    }

    return undefined
  }

  dot_value(target: Value, name: string): undefined | Value {
    for (const entry of this.entries) {
      if (entry.name === name) {
        return entry.value
      }
    }

    return undefined
  }

  get names(): Array<string> {
    return this.entries.map((entry) => entry.name)
  }

  extend_ctx(ctx: Ctx): Ctx {
    for (const { name, t, value } of this.entries) {
      ctx = ctx.extend(name, t, value)
    }

    return ctx
  }
}
