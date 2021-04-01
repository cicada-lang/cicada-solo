import { Exp, AlphaCtx } from "@/exp"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Value } from "@/value"
import { ClsValue, ObjValue, TypeValue } from "@/core"
import { evaluate } from "@/evaluate"
import { check } from "@/check"
import { conversion } from "@/conversion"
import { readback } from "@/readback"
import { expect } from "@/expect"
import { Trace } from "@/trace"
import * as ut from "@/ut"

export class Obj implements Exp {
  properties: Map<string, Exp>

  constructor(opts: { properties: Map<string, Exp> }) {
    this.properties = opts.properties
  }

  evaluate(env: Env): Value {
    const properties = new Map()

    for (const [name, exp] of this.properties) {
      properties.set(name, evaluate(env, exp))
    }

    return new ObjValue({ properties })
  }

  check(ctx: Ctx, t: Value): void {
    const cls = expect(ctx, t, ClsValue)

    // NOTE We DO NOT need to update the `ctx` as we go along.
    // - just like checking `cons`.

    // NOTE We will delete entries in the Map properties as we go along.
    const properties = new Map(this.properties)

    for (const { name, t, value } of cls.fulfilled) {
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

      properties.delete(name)
    }

    if (cls.telescope.empty_p()) return

    // TODO
  }

  repr(): string {
    throw new Error("TODO")
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error("TODO")
  }
}
