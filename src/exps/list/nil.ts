import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { expect } from "../../expect"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Nil extends Exp {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exp {
    return this
  }

  check(ctx: Ctx, t: Value): Core {
    expect(ctx, t, Cores.ListValue)
    return new Cores.Nil()
  }

  repr(): string {
    return "nil"
  }
}
