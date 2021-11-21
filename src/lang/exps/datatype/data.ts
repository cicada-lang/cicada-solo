import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class Data extends Exp {
  type_ctor_name: string
  name: string
  args: Array<Exp>

  constructor(type_ctor_name: string, name: string, args: Array<Exp>) {
    super()
    this.type_ctor_name = type_ctor_name
    this.name = name
    this.args = args
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set(
      this.args.flatMap((arg) => Array.from(arg.free_names(bound_names)))
    )
  }

  subst(name: string, exp: Exp): Exp {
    return new Data(
      this.type_ctor_name,
      this.name,
      this.args.map((arg) => subst(arg, name, exp))
    )
  }

  check(ctx: Ctx, t: Value): Core {
    throw new Error("TODO")
  }

  format(): string {
    const args = this.args.map((arg) => arg.format()).join(", ")

    return args.length > 0
      ? `${this.type_ctor_name}::${this.name}(${args})`
      : `${this.type_ctor_name}::${this.name}`
  }
}
