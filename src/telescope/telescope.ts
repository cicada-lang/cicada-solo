import { Env } from "@/env"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { evaluate } from "@/evaluate"
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
}
