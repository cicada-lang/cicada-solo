import { Env } from "@/env"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { evaluate } from "@/evaluate"
import { Trace } from "@/trace"
import * as ut from "@/ut"

export class Telescope {
  env: Env
  entries: Array<{ name: string; t: Exp; exp?: Exp }>

  constructor(env: Env, entries: Array<{ name: string; t: Exp; exp?: Exp }>) {
    this.env = env
    this.entries = entries
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
      this.entries.slice(1)
    )
  }
}
