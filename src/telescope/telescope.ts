import { Env } from "@/env"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { NotYetValue, VarNeutral } from "@/core"
import { evaluate } from "@/evaluate"
import { Trace } from "@/trace"
import * as ut from "@/ut"

export class Telescope {
  env: Env
  demanded: Array<{ name: string; t: Exp }>

  constructor(env: Env, demanded: Array<{ name: string; t: Exp }>) {
    this.env = env
    this.demanded = demanded
  }

  get next(): undefined | { name: string; t: Value } {
    if (this.demanded.length === 0) {
      return undefined
    }

    const [{ name, t }] = this.demanded

    return { name, t: evaluate(this.env, t) }
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
      this.demanded.slice(1)
    )
  }
