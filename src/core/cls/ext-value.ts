import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { Cls, Obj, Dot, TypeValue } from "../../core"
import { NotYetValue, VarNeutral } from "../../core"
import { Telescope } from "../../telescope"
import { readback } from "../../readback"
import { conversion } from "../../conversion"
import { Trace } from "../../trace"
import * as ut from "../../ut"

// NOTE `Ext` can not evaluate to `ClsValue`,
//   because we need lexical scope,
//   we need to use `ExtValue` to chain `ClsValue`.

export class ExtValue {
  entries: Array<{ name?: string; telescope: Telescope }>
  name?: string

  constructor(
    entries: Array<{ name?: string; telescope: Telescope }>,
    opts?: { name?: string }
  ) {
    this.entries = entries
    this.name = opts?.name
  }

  // NOTE ExtValue should be readback to Cls instead of Ext.
  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      let entries = new Array()
      for (const { telescope } of this.entries) {
        const { entries: next_entries, ctx: next_ctx } = telescope.readback(ctx)
        entries = [...entries, ...next_entries]
        ctx = next_ctx
      }

      return new Cls(entries, { name: this.name })
    }
  }

  eta_expand(ctx: Ctx, value: Value): Exp {
    let properties = new Map()
    for (const { telescope } of this.entries) {
      properties = new Map([
        ...properties,
        ...telescope.eta_expand_properties(ctx, value),
      ])
    }

    return new Obj(properties)
  }

  dot(target: Value, name: string): Value {
    for (const { telescope } of this.entries) {
      try {
        return telescope.dot(target, name)
      } catch (error) {
        // NOTE try next one
      }
    }

    throw new Trace(
      ut.aline(`
        |The property name: ${name} of extended class is undefined.
        |`)
    )
  }

  apply(arg: Value): Value {
    for (const [index, entry] of this.entries.entries()) {
      let telescope = entry.telescope
      while (telescope.next !== undefined) {
        const { value } = telescope.next
        if (value) {
          telescope = telescope.fill(value)
        } else {
          return new ExtValue(
            this.entries.splice(index, 1, {
              name: entry.name,
              telescope: telescope.fill(arg),
            }),
            { name: this.name }
          )
        }
      }
    }

    throw new Trace(
      ut.aline(`
        |The telescope is full.
        |`)
    )
  }

  extend_ctx(ctx: Ctx): Ctx {
    for (const { telescope } of this.entries) {
      ctx = telescope.extend_ctx(ctx)
    }
    return ctx
  }
}
