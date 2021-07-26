import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { check } from "../../exp"
import { evaluate } from "../../core"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class PiImplicit extends Exp {
  given: { name: string; arg_t: Exp }
  name: string
  arg_t: Exp
  ret_t: Exp

  constructor(
    given: { name: string; arg_t: Exp },
    name: string,
    arg_t: Exp,
    ret_t: Exp
  ) {
    super()
    this.given = given
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    throw new Error("TODO")
    // return new Set([
    //   ...this.arg_t.free_names(bound_names),
    //   ...this.ret_t.free_names(new Set([...bound_names, this.name])),
    // ])
  }

  subst(name: string, exp: Exp): Exp {
    throw new Error("TODO")
    // if (name === this.name) {
    //   return new PiImplicit(this.name, this.arg_t.subst(name, exp), this.ret_t)
    // } else {
    //   const free_names = exp.free_names(new Set())
    //   const fresh_name = ut.freshen_name(free_names, this.name)
    //   const ret_t = this.ret_t.subst(this.name, new Exps.Var(fresh_name))

    //   return new PiImplicit(
    //     fresh_name,
    //     this.arg_t.subst(name, exp),
    //     ret_t.subst(name, exp)
    //   )
    // }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error("TODO")
    // const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
    // const arg_t_core = check(ctx, this.arg_t, new Exps.TypeValue())
    // const arg_t_value = evaluate(ctx.to_env(), arg_t_core)
    // const ret_t = this.ret_t.subst(this.name, new Exps.Var(fresh_name))
    // const ret_t_core = check(
    //   ctx.extend(fresh_name, arg_t_value),
    //   ret_t,
    //   new Exps.TypeValue()
    // )

    // return {
    //   t: new Exps.TypeValue(),
    //   core: new Exps.PiCore(fresh_name, arg_t_core, ret_t_core),
    // }
  }

  private multi_pi(
    entries: Array<{ name: string; arg_t: Exp }> = new Array()
  ): {
    entries: Array<{ name: string; arg_t: Exp }>
    ret_t: Exp
  } {
    throw new Error("TODO")

    // const entry = { name: this.name, arg_t: this.arg_t }

    // if (this.ret_t instanceof PiImplicit) {
    //   return this.ret_t.multi_pi([...entries, entry])
    // } else {
    //   return {
    //     entries: [...entries, entry],
    //     ret_t: this.ret_t,
    //   }
    // }
  }

  repr(): string {
    throw new Error("TODO")
    // const { entries, ret_t } = this.multi_pi()
    // const entries_repr = entries
    //   .map(({ name, arg_t }) => `${name}: ${arg_t.repr()}`)
    //   .join(", ")
    // return `(${entries_repr}) -> ${ret_t.repr()}`
  }
}
