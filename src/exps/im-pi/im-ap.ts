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
import { ImApInsertion } from "./im-ap-insertion"

export class ImAp extends Exp {
  target: Exp
  args: Array<{ name: string; arg: Exp }>

  constructor(target: Exp, args: Array<{ name: string; arg: Exp }>) {
    super()
    this.target = target
    this.args = args
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.args.flatMap(({ arg }) => [...arg.free_names(bound_names)]),
    ])
  }

  subst(name: string, exp: Exp): ImAp {
    return new ImAp(
      subst(this.target, name, exp),
      this.args.map((entry) => ({
        name: entry.name,
        arg: subst(entry.arg, name, exp),
      }))
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    // NOTE We already need to insert im-ap here.
    // NOTE The insertion will reorder the arguments (reverse of im-fn insertion).

    const { t, core } = infer(ctx, this.target)

    if (!ImApInsertion.based_on(t)) {
      throw new Trace(
        `I can not do im-ap insertion based on: ${t.constructor.name}`
      )
    }

    // TODO limit target type

    const ap = this.target

    if (!(ap instanceof Exps.Ap)) {
      throw new Trace(
        [
          `I expect that target of ImAp to be Ap.`,
          `  class name: ${ap.constructor.name}`,
        ].join("\n")
      )
    }

    throw new Error("TODO")

    // TODO should take `this.arg`

    // return t.insert_im_ap(ctx, ap, core, this.args)
  }

  ap_args_repr(): Array<string> {
    const entries = this.args
      .map(({ name, arg }) => `${name}: ${arg.repr()}`)
      .join(", ")

    const args = `implicit { ${entries} }`

    if (has_ap_args_repr(this.target)) {
      return [...this.target.ap_args_repr(), args]
    } else {
      return [args]
    }
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
