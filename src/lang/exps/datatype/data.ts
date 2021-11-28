import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { expect } from "../../value"
import { check_conversion } from "../../value"
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
    if (t instanceof Exps.TypeCtorValue && t.arity === 0) {
      t = t.as_datatype()
    }

    const datatype = expect(ctx, t, Exps.DatatypeValue)

    if (this.type_ctor_name !== datatype.type_ctor.name) {
      throw new ExpTrace(
        [
          `I expect the type constructor name to be ${datatype.type_ctor.name}`,
          `  given type constructor: ${this.type_ctor_name}`,
        ].join("\n")
      )
    }

    const data_ctor = datatype.type_ctor.get_data_ctor(this.name)

    if (this.args.length !== data_ctor.bindings.length) {
      throw new ExpTrace(
        [
          `I expect the number of arguments the same as the data constructor bindings.length`,
          `  numebr of arguments: ${this.args.length}`,
          `  data constructor bindings.length: ${data_ctor.bindings.length}`,
        ].join("\n")
      )
    }

    const args: Array<Core> = []
    const result = data_ctor.apply({
      fixed_args: datatype.args,
      args: (index, { arg_t, env }) => {
        const arg_core = check(ctx, this.args[index], arg_t)
        const arg = evaluate(env, arg_core)
        args.push(arg_core)
        return arg
      },
    })

    let ctor_ret_t = evaluate(result.env, data_ctor.finial_ret_t_core)

    if (ctor_ret_t instanceof Exps.TypeCtorValue && ctor_ret_t.arity === 0) {
      ctor_ret_t = ctor_ret_t.as_datatype()
    }

    check_conversion(ctx, new Exps.TypeValue(), ctor_ret_t, datatype, {
      description: {
        from: "data constructor return type",
        to: "given datatype",
      },
    })

    return new Exps.DataCore(this.type_ctor_name, this.name, args)
  }

  format(): string {
    const args = this.args.map((arg) => arg.format()).join(", ")

    return args.length > 0
      ? `${this.type_ctor_name}::${this.name}(${args})`
      : `${this.type_ctor_name}::${this.name}`
  }
}
