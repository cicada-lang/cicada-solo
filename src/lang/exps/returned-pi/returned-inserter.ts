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
    entries: Array<Exps.ArgEntry>,
    t: Value
  ): Core {
    let result_core = target_core
    for (const entry of this.collect_returned_ap_entries(ctx, [], t)) {
      const arg_core = readback(ctx, entry.arg_t, entry.returned_arg)
      result_core = new Exps.ReturnedApCore(result_core, arg_core)
    }

    for (const entry of this.check_arg_entries(ctx, entries)) {
      if (entry.kind === "implicit") {
        result_core = new Exps.ImplicitApCore(result_core, entry.arg)
      } else if (entry.kind === "returned") {
        result_core = new Exps.ReturnedApCore(result_core, entry.arg)
      } else {
        result_core = new Exps.ApCore(result_core, entry.arg)
      }
    }

    return result_core
  }

  private collect_returned_ap_entries(
    ctx: Ctx,
    entries: Array<ReturnedApEntry>,
    t: Value
  ): Array<ReturnedApEntry> {
    throw new Error("TODO")
  }

  private check_arg_entries(
    ctx: Ctx,
    entries: Array<Exps.ArgEntry>
  ): Array<Exps.ArgEntryCore> {
    throw new Error("TODO")
  }
}
