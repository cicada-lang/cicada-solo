import { Exp, ExpMeta, subst } from "../exp"
import { Narrator } from "../narrator"
import { Ctx } from "../ctx"
import { Value } from "../value"
import { readback } from "../value"
import { Core } from "../core"
import * as Exps from "../exps"

export class Todo extends Exp {
  meta: ExpMeta
  note: string

  constructor(note: string, meta: ExpMeta) {
    super()
    this.meta = meta
    this.note = note
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): this {
    return this
  }

  repr(): string {
    return `@TODO ${new Exps.QuoteCore(this.note).repr()}`
  }

  check(ctx: Ctx, t: Value): Core {
    const t_core = readback(ctx, new Exps.TypeValue(), t)

    {
      const lines = [
        //
        `@TODO ${this.note}`,
        `  ${t_core.repr()}`,
        ``,
      ]
      const story = lines.join("\n")
      console.log(story)
    }

    return new Exps.TodoCore(this.note, t)
  }
}
