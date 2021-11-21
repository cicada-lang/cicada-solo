import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class DataCore extends Core {
  meta: ExpMeta
  type_ctor_name: string
  name: string
  args: Array<Core>

  constructor(
    type_ctor_name: string,
    name: string,
    args: Array<Core>,
    meta: ExpMeta
  ) {
    super()
    this.type_ctor_name = type_ctor_name
    this.name = name
    this.args = args
    this.meta = meta
  }

  evaluate(env: Env): Value {
    throw new Error("TODO")
  }

  format(): string {
    throw new Error("TODO")
    // return `vec(${this.head.format()}, ${this.tail.format()})`
  }

  alpha_format(ctx: AlphaCtx): string {
    throw new Error("TODO")
    // return `vec(${this.head.alpha_format(ctx)}, ${this.tail.alpha_format(ctx)})`
  }
}
