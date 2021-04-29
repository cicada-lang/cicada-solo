import { Env } from "../env"
import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { TypeValue } from "../core"
import { NotYetValue, VarNeutral } from "../core"
import { conversion } from "../conversion"
import { readback } from "../readback"
import { evaluate } from "../evaluate"
import { check } from "../check"
import { Trace } from "../trace"
import { Dot } from "../core"
import * as ut from "../ut"

export class Telescope {
  ctx: Ctx
  env: Env
  entries: Array<{ name: string; t: Exp; exp?: Exp }>
  fulfilled: Array<{ name: string; t: Value; value: Value }>

  constructor(
    ctx: Ctx,
    env: Env,
    entries: Array<{ name: string; t: Exp; exp?: Exp }>,
    fulfilled?: Array<{ name: string; t: Value; value: Value }>
  ) {
    this.ctx = ctx
    this.env = env
    this.entries = entries
    this.fulfilled = fulfilled || []
  }

  get next(): undefined | { name: string; t: Value; value?: Value } {
    if (this.entries.length === 0) return undefined
    const [{ name, t, exp }] = this.entries
    return {
      name,
      t: evaluate(this.ctx, this.env, t),
      value: exp ? evaluate(this.ctx, this.env, exp) : undefined,
    }
  }

  fill(value: Value): Telescope {
    if (!this.next) {
      throw new Trace(
        ut.aline(`
          |Filling fulled telescope.
          |- telescope: ${ut.inspect(this)}
          |- value: ${ut.inspect(value)}
          |`)
      )
    }

    return new Telescope(
      this.ctx.extend(this.next.name, this.next.t, value),
      this.env.extend(this.next.name, this.next.t, value),
      this.entries.slice(1),
      [
        ...this.fulfilled,
        {
          name: this.next.name,
          t: this.next.t,
          value,
        },
      ]
    )
  }

  dot(target: Value, name: string): Value {
    for (const entry of this.fulfilled) {
      if (entry.name === name) {
        return entry.t
      }
    }

    let telescope: Telescope = this
    while (telescope.next) {
      const { name: next_name, t } = telescope.next
      if (next_name !== name) {
        telescope = telescope.fill(Dot.apply(target, next_name))
      } else {
        return t
      }
    }

    throw new Trace(
      ut.aline(`
        |The property name: ${name} of class is undefined.
        |`)
    )
  }

  readback(
    ctx: Ctx
  ): {
    entries: Array<{ name: string; t: Exp; exp?: Exp }>
    ctx: Ctx
  } {
    const entries = []

    for (const { name, t, value } of this.fulfilled) {
      const t_exp = readback(ctx, new TypeValue(), t)
      const exp = readback(ctx, t, value)
      entries.push({ name, t: t_exp, exp })
      ctx = ctx.extend(name, t, value)
    }

    let telescope: Telescope = this
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

    return { entries, ctx }
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Exp> {
    const properties = new Map()

    for (const { name, t, value: fulfilled_value } of this.fulfilled) {
      const property_value = Dot.apply(value, name)
      if (!conversion(ctx, t, property_value, fulfilled_value)) {
        throw new Trace("property_value not equivalent to fulfilled_value")
      }
      const property_exp = readback(ctx, t, property_value)
      properties.set(name, property_exp)
    }

    let telescope: Telescope = this
    while (telescope.next) {
      const { name, t, value: fulfilled_value } = telescope.next
      if (fulfilled_value) {
        const property_value = Dot.apply(value, name)
        if (!conversion(ctx, t, property_value, fulfilled_value)) {
          throw new Trace("property_value not equivalent to fulfilled_value")
        }
        const property_exp = readback(ctx, t, property_value)
        properties.set(name, property_exp)
        telescope = telescope.fill(property_value)
      } else {
        const property_value = Dot.apply(value, name)
        const property_exp = readback(ctx, t, property_value)
        properties.set(name, property_exp)
        telescope = telescope.fill(property_value)
      }
    }

    return properties
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): void {
    // NOTE We DO NOT need to update the `ctx` as we go along.
    // - the bindings in telescope will not effect current ctx.
    // - just like checking `cons`.

    for (const { name, t, value } of this.fulfilled) {
      const found = properties.get(name)

      if (found === undefined) {
        throw new Trace(
          ut.aline(`
            |Can not found satisfied entry name: ${name}
            |`)
        )
      }

      check(ctx, found, t)

      const found_value = evaluate(ctx, ctx.to_env(), found)

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

    let telescope: Telescope = this
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
        const found_value = evaluate(ctx, ctx.to_env(), found)
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

      telescope = telescope.fill(evaluate(ctx, ctx.to_env(), found))
    }
  }

  extend_ctx(ctx: Ctx): Ctx {
    for (const { name, t, value } of this.fulfilled) {
      ctx = ctx.extend(name, t, value)
    }
    for (const { name, t, exp } of this.entries) {
      const env = ctx.to_env()
      if (exp) {
        ctx = ctx.extend(name, evaluate(ctx, env, t), evaluate(ctx, env, exp))
      } else {
        ctx = ctx.extend(name, evaluate(ctx, env, t))
      }
    }
    return ctx
  }
}
