import { Env } from "@/env"
import { Exp } from "@/exp"
import { Value } from "@/value"

export class Telescope {
  env: Env
  demanded: Array<{ name: string; t: Exp }>

  constructor(opts: { env: Env; demanded: Array<{ name: string; t: Exp }> }) {
    this.env = opts.env
    this.demanded = opts.demanded
  }

  empty_p(): boolean {
    return this.demanded.length === 0
  }
}
