import { Env } from "@/env"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { evaluate } from "@/evaluate"

export class Telescope {
  env: Env
  demanded: Array<{ name: string; t: Exp }>

  constructor(opts: { env: Env; demanded: Array<{ name: string; t: Exp }> }) {
    this.env = opts.env
    this.demanded = opts.demanded
  }

  get next(): undefined | { name: string; t: Value } {
    if (this.demanded.length === 0) return undefined

    const [{ name, t }] = this.demanded

    return { name, t: evaluate(this.env, t) }
  }

  // TODO
  // fill
}
