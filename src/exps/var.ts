import { Exp } from "../exp"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import { Trace } from "../trace"
import * as Cores from "../cores"

export class Var extends Exp {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t = ctx.lookup_type(this.name)
    if (t === undefined) {
      throw new Trace(
        `Fail to infer the type of a variable.\n` +
          `The name ${this.name} is undefined.`
      )
    }

    return {
      t,
      core: new Cores.Var(this.name),
    }
  }

  repr(): string {
    return this.name
  }
}
