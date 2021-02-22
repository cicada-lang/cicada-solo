import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Nat implements Exp {
  kind = "Nat"

  constructor() {}

  evaluability(env: Env): Value.Value {
    return Value.nat
  }

  inferability(ctx: Ctx): Value.Value {
    return Value.type
  }

  repr(): string {
    return "Nat"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "Nat"
  }
}
