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
    const datatype =
      t instanceof Exps.TypeCtorValue
        ? new Exps.DatatypeValue(t, [])
        : expect(ctx, t, Exps.DatatypeValue)

    if (this.type_ctor_name !== datatype.type_ctor.name) {
      throw new ExpTrace(
        [
          `I expect the type constructor name to be ${datatype.type_ctor.name}`,
          `  given type constructor: ${this.type_ctor_name}`,
        ].join("\n")
      )
    }

    const fixed = datatype.type_ctor.fixed
    let env = datatype.type_ctor.env

    for (const [index, [name, arg_t_core]] of Object.entries(fixed).entries()) {
      const arg_t = evaluate(env, arg_t_core)
      const arg = datatype.args[index]
      env = env.extend(name, arg)
      ctx = ctx.extend(name, arg_t, arg)
    }

    const ctor_bindings = datatype.type_ctor.ctor_bindings(this.name)
    const args: Array<Core> = []
    for (const [index, binding] of ctor_bindings.entries()) {
      const name = binding.name
      const arg_t = evaluate(env, binding.arg_t)
      const arg_core = check(ctx, this.args[index], arg_t)
      const arg = evaluate(env, arg_core)
      args.push(arg_core)
      env = env.extend(name, arg)
      ctx = ctx.extend(name, arg_t, arg)
    }

    const ctor_ret_t_core = datatype.type_ctor.ctor_ret_t(this.name)
    let ctor_ret_t = evaluate(env, ctor_ret_t_core)

    ctor_ret_t =
      ctor_ret_t instanceof Exps.TypeCtorValue
        ? new Exps.DatatypeValue(ctor_ret_t, [])
        : ctor_ret_t

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
