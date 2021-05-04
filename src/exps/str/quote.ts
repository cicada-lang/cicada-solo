import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Quote extends Exp {
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Cores.StrValue(),
      core: new Cores.Quote(this.str),
    }
  }

  repr(): string {
    return `"${this.str}"`
  }
}
