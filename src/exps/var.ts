import { Exp, subst } from "../exp"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { Value } from "../value"
import { Trace } from "../errors"
import * as Exps from "../exps"

export class Var extends Exp {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  free_names(bound_names: Set<string>): Set<string> {
    if (bound_names.has(this.name)) {
      return new Set()
    } else {
      return new Set([this.name])
    }
  }

  subst(name: string, exp: Exp): Exp {
    if (name === this.name) {
      return exp
    } else {
      return this
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t = ctx.find_type(this.name)
    if (t === undefined) {
      throw new Trace(
        `Fail to infer the type of a variable.\n` +
          `The name ${this.name} is undefined.`
      )
    }

    return {
      t,
      core: new Exps.VarCore(this.name),
    }
  }

  repr(): string {
    return this.name
  }
}
