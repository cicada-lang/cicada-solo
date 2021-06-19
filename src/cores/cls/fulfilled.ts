import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { readback } from "../../readback"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { check_conversion } from "../../conversion"
import { Trace } from "../../trace"
import * as Cores from "../../cores"
import * as ut from "../../ut"

import { FulfilledEntry } from "./fulfilled-entry"

export class Fulfilled {
  entries: Array<FulfilledEntry>

  constructor(entries: Array<FulfilledEntry> = new Array()) {
    this.entries = entries
  }

  fill_entry(
    field_name: string,
    local_name: string,
    t: Value,
    value: Value
  ): Fulfilled {
    return new Fulfilled([
      ...this.entries,
      new FulfilledEntry(field_name, t, value, local_name),
    ])
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    const cores: Map<string, Core> = new Map()

    for (const { field_name, t, value } of this.entries) {
      const found = properties.get(field_name)

      if (found === undefined) {
        throw new Trace(
          ut.aline(`
            |Can not found satisfied field_name: ${field_name}
            |`)
        )
      }

      const found_core = check(ctx, found, t)
      cores.set(field_name, found_core)
      const found_value = evaluate(ctx.to_env(), found_core)

      check_conversion(ctx, t, value, found_value, {
        description: {
          from: "the value in object",
          to: "the value in partially filled class",
        },
      })
    }

    return cores
  }

  readback_aux(
    ctx: Ctx,
    t: Value
  ): { entries: Array<Cores.ClsEntry>; ctx: Ctx } {
    const entries: Array<Cores.ClsEntry> = []

    for (const { field_name, local_name, t, value } of this.entries) {
      const fresh_name = ut.freshen_name(new Set(ctx.names), local_name)
      const t_core = readback(ctx, new Cores.TypeValue(), t)
      const core = readback(ctx, t, value)
      entries.push(new Cores.ClsEntry(field_name, t_core, core, fresh_name))
      ctx = ctx.extend(fresh_name, t, value)
    }

    return { entries, ctx }
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core> {
    const properties = new Map()

    for (const entry of this.entries) {
      const property_value = Cores.Dot.apply(value, entry.field_name)

      check_conversion(ctx, entry.t, property_value, entry.value, {
        description: {
          from: "the property value",
          to: "the fulfilled entry value",
        },
      })

      const property_exp = readback(ctx, entry.t, property_value)
      properties.set(entry.field_name, property_exp)
    }

    return properties
  }

  dot_type(target: Value, name: string): undefined | Value {
    for (const entry of this.entries) {
      if (name === entry.field_name) {
        return entry.t
      }
    }

    return undefined
  }

  dot_value(target: Value, name: string): undefined | Value {
    for (const entry of this.entries) {
      if (name === entry.field_name) {
        return entry.value
      }
    }

    return undefined
  }

  get names(): Array<string> {
    return this.entries.map((entry) => entry.field_name)
  }

  extend_ctx(ctx: Ctx): Ctx {
    for (const { field_name, local_name, t, value } of this.entries) {
      ctx = ctx.extend(local_name, t, value)
    }

    return ctx
  }
}
