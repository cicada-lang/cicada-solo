import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { check } from "../../exp"
import { subst } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { Value } from "../../value"
import { readback } from "../../value"
import * as Exps from ".."
import * as ut from "../../../ut"
import { Closure } from "../closure"
import { ExpTrace } from "../../errors"

interface ReturnedApEntry {
  arg_t: Value
  returned_arg: Value
}

export class ReturnedInserter {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  insert_returned_ap(
    ctx: Ctx,
    target_core: Core,
    arg_entries: Array<Exps.ArgEntry>,
    t: Value
  ): Core {
    const solution = Solution.empty.unify_or_fail(
      ctx,
      new Exps.TypeValue(),
      this.finial_ret_t(ctx, this.arg_t, this.ret_t_cl),
      t
    )

    const returned_ap_entries = this.collect_returned_ap_entries(
      ctx,
      solution,
      []
    )

    let result_core = target_core
    for (const entry of returned_ap_entries) {
      const arg_core = readback(ctx, entry.arg_t, entry.returned_arg)
      result_core = new Exps.ReturnedApCore(result_core, arg_core)
    }

    const half_ret_t = this.half_ret_t(ctx, this.ret_t_cl, returned_ap_entries)

    for (const arg_entry of this.check_arg_entries(
      ctx,
      half_ret_t,
      arg_entries
    )) {
      if (arg_entry.kind === "implicit") {
        result_core = new Exps.ImplicitApCore(result_core, arg_entry.arg)
      } else if (arg_entry.kind === "returned") {
        result_core = new Exps.ReturnedApCore(result_core, arg_entry.arg)
      } else {
        result_core = new Exps.ApCore(result_core, arg_entry.arg)
      }
    }

    return result_core
  }

  private finial_ret_t(ctx: Ctx, arg_t: Value, ret_t_cl: Closure): Value {
    const fresh_name = ctx.freshen(ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(arg_t, variable)
    const ret_t = ret_t_cl.apply(not_yet_value)

    if (
      ret_t instanceof Exps.ReturnedPiValue ||
      ret_t instanceof Exps.ImplicitPiValue ||
      ret_t instanceof Exps.PiValue
    ) {
      return this.finial_ret_t(ctx, ret_t.arg_t, ret_t.ret_t_cl)
    } else {
      return ret_t
    }
  }

  private half_ret_t(
    ctx: Ctx,
    ret_t_cl: Closure,
    returned_ap_entries: Array<ReturnedApEntry>
  ): Value {
    const [entry, ...rest] = returned_ap_entries
    const ret_t = ret_t_cl.apply(entry.returned_arg)

    if (ret_t instanceof Exps.ReturnedPiValue) {
      return this.half_ret_t(ctx, ret_t.ret_t_cl, rest)
    } else {
      return ret_t
    }
  }

  private collect_returned_ap_entries(
    ctx: Ctx,
    solution: Solution,
    entries: Array<ReturnedApEntry>
  ): Array<ReturnedApEntry> {
    const entry = this.returned_ap_entry(ctx, solution)
    const ret_t = this.ret_t_cl.apply(entry.returned_arg)

    if (ret_t instanceof Exps.ReturnedPiValue) {
      return ret_t.returned_inserter.collect_returned_ap_entries(
        ctx,
        solution,
        [...entries, entry]
      )
    } else {
      return [...entries, entry]
    }
  }

  private returned_ap_entry(ctx: Ctx, solution: Solution): ReturnedApEntry {
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const returned_arg = solution.find(fresh_name)
    if (returned_arg === undefined) {
      throw new ExpTrace(
        [
          `Fail to find ${fresh_name} in solution`,
          `  solution names: ${solution.names}`,
          `  this.arg_t class name: ${this.arg_t.constructor.name}`,
        ].join("\n")
      )
    }

    return { arg_t: this.arg_t, returned_arg }
  }

  private check_arg_entries(
    ctx: Ctx,
    pi: Value,
    arg_entries: Array<Exps.ArgEntry>
  ): Array<Exps.ArgCoreEntry> {
    const arg_core_entries: Array<Exps.ArgCoreEntry> = []
    for (const arg_entry of arg_entries) {
      if (pi instanceof Exps.PiValue) {
        const arg_core = check(ctx, arg_entry.arg, pi.arg_t)
        arg_core_entries.push({
          kind: arg_entry.kind,
          arg: arg_core,
        })
        pi = pi.ret_t_cl.apply(evaluate(ctx.to_env(), arg_core))
      } else if (pi instanceof Exps.ImplicitPiValue) {
        throw new ExpTrace(`I can not handle implicit under returned yet.`)
      } else if (pi instanceof Exps.ReturnedPiValue) {
        throw new ExpTrace(`I expect pi to NOT be Exps.ReturnedPiValue.`)
      } else {
        throw new ExpTrace(
          [
            `I expect pi to be Exps.PiValue or Exps.ImplicitPiValue`,
            `  class name: ${pi.constructor.name}`,
          ].join("\n")
        )
      }
    }

    return arg_core_entries
  }
}
