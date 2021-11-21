import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { expect } from "../../value"
import { ExpTrace } from "../../errors"
import { Solution } from "../../solution"
import { check } from "../../exp"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class Data extends Exp {
  meta: ExpMeta
  type_ctor_name: string
  name: string
  args: Array<Exp>

  constructor(
    type_ctor_name: string,
    name: string,
    args: Array<Exp>,
    meta: ExpMeta
  ) {
    super()
    this.meta = meta
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
      this.args.map((arg) => subst(arg, name, exp)),
      this.meta
    )
  }

  check(ctx: Ctx, t: Value): Core {
    const datatype = expect(ctx, t, Exps.DatatypeValue)

    if (this.type_ctor_name !== datatype.type_ctor.name) {
      throw new ExpTrace(
        [
          `I expect the type constructor name to be ${datatype.type_ctor.name}`,
          `  given type constructor: ${this.type_ctor_name}`,
        ].join("\n")
      )
    }

    const ctor_t_core = datatype.type_ctor.ctors[this.name]

    if (ctor_t_core === undefined) {
      const names = Object.keys(datatype.type_ctor.ctors).join(", ")
      throw new ExpTrace(
        [
          `I meet unknown data constructor name ${this.name}`,
          `  type constructor name: ${this.type_ctor_name}`,
          `  existing names: ${names}`,
        ].join("\n")
      )
    }

    let env = datatype.type_ctor.env

    datatype.args
    datatype.type_ctor.fixed

    const ctor_t = evaluate(env, ctor_t_core)

    throw new Error("TODO")

    // const args =
    // return new Exps.DataCore(this.type_ctor_name, this.name, args)
  }

  format(): string {
    const args = this.args.map((arg) => arg.format()).join(", ")

    return args.length > 0
      ? `${this.type_ctor_name}::${this.name}(${args})`
      : `${this.type_ctor_name}::${this.name}`
  }
}
