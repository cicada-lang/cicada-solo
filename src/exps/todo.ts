import { Exp, ExpMeta, subst } from "../exp"
import { Ctx } from "../ctx"
import { Value } from "../value"
import { Core } from "../core"
import { TodoCore } from "./todo-core"
import { QuoteCore } from "./str/quote-core"

export class Todo extends Exp {
  meta?: ExpMeta
  message: string

  constructor(message: string, meta?: ExpMeta) {
    super()
    this.message = message
    this.meta = meta
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): this {
    return this
  }

  repr(): string {
    return `TODO(${new QuoteCore(this.message).repr()})`
  }

  check(ctx: Ctx, t: Value): Core {
    return new TodoCore(this.message, t)
  }
}
