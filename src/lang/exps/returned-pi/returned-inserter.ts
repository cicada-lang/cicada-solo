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
    const finial_ret_t = this.finial_ret_t(ctx, this.arg_t, this.ret_t_cl)
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

    for (const arg_entry of this.check_arg_entries(ctx, arg_entries)) {
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
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = this.ret_t_cl.apply(not_yet_value)

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
    } else if (ret_t instanceof Exps.PiValue) {
      return [...entries, entry]
    } else {
      throw new ExpTrace(
        [
          `During application insertion`,
          `I expect the return type to be Exps.PiValue or Exps.ReturnedPiValue`,
          `  class name: ${ret_t.constructor.name}`,
        ].join("\n")
      )
    }
  }

  private returned_ap_entry(ctx: Ctx, solution: Solution): ReturnedApEntry {
    throw new Error("TODO")
  }

  private check_arg_entries(
    ctx: Ctx,
    arg_entries: Array<Exps.ArgEntry>
  ): Array<Exps.ArgEntryCore> {
    throw new Error("TODO")
  }
}
