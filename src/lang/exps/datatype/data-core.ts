import { Exp } from "../../exp"
import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class DataCore extends Core {
  type_ctor_name: string
  name: string
  args: Array<Core>

  constructor(type_ctor_name: string, name: string, args: Array<Core>) {
    super()
    this.type_ctor_name = type_ctor_name
    this.name = name
    this.args = args
  }

  evaluate(env: Env): Value {
    throw new Error("TODO")
  }

  format(): string {
    const args = this.args.map((arg) => arg.format()).join(", ")

    return args.length > 0
      ? `${this.type_ctor_name}::${this.name}(${args})`
      : `${this.type_ctor_name}::${this.name}`
  }

  alpha_format(ctx: AlphaCtx): string {
    const args = this.args.map((arg) => arg.alpha_format(ctx)).join(", ")

    return args.length > 0
      ? `${this.type_ctor_name}::${this.name}(${args})`
      : `${this.type_ctor_name}::${this.name}`
  }
}
