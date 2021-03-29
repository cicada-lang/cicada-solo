import { Env } from "@/env"
import { Exp } from "@/exp"
import { Value } from "@/value"

export class Telescope {
  env: Env
  next: undefined | { name: string; t: Value }
  demanded: Array<{ name: string; t: Exp }>

  constructor(opts: {
    env: Env
    next: undefined | { name: string; t: Value }
    demanded: Array<{ name: string; t: Exp }>
  }) {
    this.env = opts.env
    this.next = opts.next
    this.demanded = opts.demanded
  }
}
