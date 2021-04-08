import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { Cls, Obj, Dot, TypeValue } from "@/core"
import { NotYetValue, VarNeutral } from "@/core"
import { Telescope } from "@/telescope"
import { readback } from "@/readback"
import { conversion } from "@/conversion"
import { Trace } from "@/trace"
import * as ut from "@/ut"

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
      const entries = new Array()
      for (const entry of this.entries) {
        for (const { name, t, value } of entry.telescope.fulfilled) {
          const t_exp = readback(ctx, new TypeValue(), t)
          const exp = readback(ctx, t, value)
          entries.push({ name, t: t_exp, exp })
          ctx = ctx.extend(name, t, value)
        }
        let telescope = entry.telescope
        while (telescope.next) {
          const { name, t, value } = telescope.next
          const t_exp = readback(ctx, new TypeValue(), t)
          if (value) {
            entries.push({ name, t: t_exp, exp: readback(ctx, t, value) })
            ctx = ctx.extend(name, t, value)
            telescope = telescope.fill(new NotYetValue(t, new VarNeutral(name)))
          } else {
            entries.push({ name, t: t_exp })
            ctx = ctx.extend(name, t)
            telescope = telescope.fill(new NotYetValue(t, new VarNeutral(name)))
          }
        }
      }

      return new Cls(entries, { name: this.name })
    }
  }

  eta_expand(ctx: Ctx, value: Value): Exp {
    throw new Error("TODO")

    // const properties = new Map()

    // for (const entry of this.telescope.fulfilled) {
    //   const { name, t, value: fulfilled_value } = entry
    //   const property_value = Dot.apply(value, name)
    //   if (!conversion(ctx, t, property_value, fulfilled_value)) {
    //     throw new Trace("property_value not equivalent to fulfilled_value")
    //   }
    //   const property_exp = readback(ctx, t, property_value)
    //   properties.set(name, property_exp)
    // }

    // let telescope = this.telescope
    // while (telescope.next) {
    //   const { name, t, value: fulfilled_value } = telescope.next
    //   if (fulfilled_value) {
    //     const property_value = Dot.apply(value, name)
    //     if (!conversion(ctx, t, property_value, fulfilled_value)) {
    //       throw new Trace("property_value not equivalent to fulfilled_value")
    //     }
    //     const property_exp = readback(ctx, t, property_value)
    //     properties.set(name, property_exp)
    //     telescope = telescope.fill(property_value)
    //   } else {
    //     const property_value = Dot.apply(value, name)
    //     const property_exp = readback(ctx, t, property_value)
    //     properties.set(name, property_exp)
    //     telescope = telescope.fill(property_value)
    //   }
    // }

    // return new Obj(properties)
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
}
