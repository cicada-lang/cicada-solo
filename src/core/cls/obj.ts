import { Exp, AlphaCtx } from "@/exp"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Value } from "@/value"
import { ClsValue, ExtValue, ObjValue, TypeValue } from "@/core"
import { evaluate } from "@/evaluate"
import { check } from "@/check"
import { conversion } from "@/conversion"
import { readback } from "@/readback"
import { expect } from "@/expect"
import { Trace } from "@/trace"
import { Telescope } from "@/telescope"
import * as ut from "@/ut"

export class Obj implements Exp {
  properties: Map<string, Exp>

  constructor(properties: Map<string, Exp>) {
    this.properties = properties
  }

  evaluate(env: Env): Value {
    const properties = new Map()

    for (const [name, exp] of this.properties) {
      properties.set(name, evaluate(env, exp))
    }

    return new ObjValue(properties)
  }

  check(ctx: Ctx, t: Value): void {
    if (t instanceof ClsValue) {
      const cls = t
      check_properties(ctx, this.properties, cls.telescope)
    } else if (t instanceof ExtValue) {
      const ext = t
      for (const { telescope } of ext.entries) {
        check_properties(ctx, this.properties, telescope)
      }
    }
  }

  repr(): string {
    const s = Array.from(this.properties)
      .map(([name, exp]) => `${name}: ${exp.repr()}`)
      .join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const s = Array.from(this.properties)
      .map(([name, exp]) => `${name}: ${exp.alpha_repr(ctx)}`)
      .join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  }
}

function check_properties(
  ctx: Ctx,
  properties: Map<string, Exp>,
  telescope: Telescope
): void {
  // NOTE We DO NOT need to update the `ctx` as we go along.
  // - the bindings in telescope will not effect current ctx.
  // - just like checking `cons`.

  for (const { name, t, value } of telescope.fulfilled) {
    const found = properties.get(name)

    if (found === undefined) {
      throw new Trace(
        ut.aline(`
            |Can not found satisfied entry name: ${name}
            |`)
      )
    }

    check(ctx, found, t)

    const found_value = evaluate(ctx.to_env(), found)

    if (!conversion(ctx, t, value, found_value)) {
      const t_repr = readback(ctx, new TypeValue(), t).repr()
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

  while (telescope.next) {
    const { name, t: next_t, value } = telescope.next

    const found = properties.get(name)
    if (found === undefined) {
      throw new Trace(
        ut.aline(`
          |Can not found next name: ${name}
          |`)
      )
    }

    check(ctx, found, next_t)

    if (value) {
      const found_value = evaluate(ctx.to_env(), found)
      if (!conversion(ctx, next_t, value, found_value)) {
        const t_repr = readback(ctx, new TypeValue(), next_t).repr()
        const value_repr = readback(ctx, next_t, value).repr()
        const found_repr = readback(ctx, next_t, found_value).repr()
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

    telescope = telescope.fill(evaluate(ctx.to_env(), found))
  }
}
