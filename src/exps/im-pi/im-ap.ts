import { Exp, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Trace, InternalError } from "../../errors"
import * as ut from "../../ut"
import * as Exps from "../../exps"

export class ImAp extends Exp {
  target: Exp
  args: Array<{ name: string, arg: Exp }>

  constructor(target: Exp, args: Array<{ name: string, arg: Exp }>) {
    super()
    this.target = target
    this.args = args
  }

  free_names(bound_names: Set<string>): Set<string> {
    throw new Error("TODO")

    // const args = Array.from(this.args.values())
    // return new Set([
    //   ...this.target.free_names(bound_names),
    //   ...args.flatMap((arg) => [...arg.free_names(bound_names)]),
    // ])
  }

  subst(name: string, exp: Exp): ImAp {
    throw new Error("TODO")

    // const args = new Map(
    //   Array.from(this.args.entries()).map(([entry_name, arg]) => [
    //     entry_name,
    //     subst(arg, name, exp),
    //   ])
    // )

    // return new ImAp(subst(this.target, name, exp), args)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error("TODO")

    // const inferred_target = infer(ctx, this.target)
    // if (inferred_target.t instanceof Exps.BaseImPiValue) {
    //   const im_pi = inferred_target.t
    //   const arg_core = check(ctx, this.arg, im_pi.arg_t)
    //   const arg_value = evaluate(ctx.to_env(), arg_core)

    //   return {
    //     t: im_pi.ret_t_cl.apply(arg_value),
    //     core: new Exps.ImApCore(inferred_target.core, arg_core),
    //   }
    // }

    // throw new Trace(`I am expecting value of type: ImPiValue`)
  }

  ap_args_repr(): Array<string> {
    throw new Error("TODO")

    // const entries = this.args.repr()
    // const args = `implicit { ${entries} }`

    // if (has_ap_args_repr(this.target)) {
    //   return [...this.target.ap_args_repr(), args]
    // } else {
    //   return [arg]
    // }
  }

  ap_target_repr(): string {
    if (has_ap_target_repr(this.target)) {
      return this.target.ap_target_repr()
    } else {
      return this.target.repr()
    }
  }

  repr(): string {
    const target = this.ap_target_repr()
    const args = this.ap_args_repr().join(", ")
    return `${target}(${args})`
  }
}

function has_ap_args_repr(
  exp: Exp
): exp is Exp & { ap_args_repr(): Array<string> } {
  return (exp as any).ap_args_repr instanceof Function
}

function has_ap_target_repr(
  exp: Exp
): exp is Exp & { ap_target_repr(): string } {
  return (exp as any).ap_target_repr instanceof Function
}
