import { Env } from "@/env"
import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { TypeValue } from "@/core"
import { conversion } from "@/conversion"
import { readback } from "@/readback"
import { evaluate } from "@/evaluate"
import { check } from "@/check"
import { Trace } from "@/trace"
import { Dot } from "@/core"
import * as ut from "@/ut"

export class Telescope {
  env: Env
  entries: Array<{ name: string; t: Exp; exp?: Exp }>
  fulfilled: Array<{ name: string; t: Value; value: Value }>

  constructor(
    env: Env,
    entries: Array<{ name: string; t: Exp; exp?: Exp }>,
    fulfilled?: Array<{ name: string; t: Value; value: Value }>
  ) {
    this.env = env
    this.entries = entries
    this.fulfilled = fulfilled || []
  }

  get next(): undefined | { name: string; t: Value; value?: Value } {
    if (this.entries.length === 0) return undefined
    const [{ name, t, exp }] = this.entries
    return {
      name,
      t: evaluate(this.env, t),
      value: exp ? evaluate(this.env, exp) : undefined,
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
      this.env.extend(this.next.name, value),
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

  check_properties(ctx: Ctx, properties: Map<string, Exp>): void {
    // NOTE We DO NOT need to update the `ctx` as we go along.
    // - the bindings in telescope will not effect current ctx.
    // - just like checking `cons`.

    let telescope: Telescope = this

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
}
