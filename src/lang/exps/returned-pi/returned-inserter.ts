import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { check } from "../../exp"
import { infer } from "../../exp"
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
    const { solution, number_of_solved_args } = solve_returned_args(
      ctx,
      new Exps.ReturnedPiValue(this.arg_t, this.ret_t_cl),
      t
    )

    const returned_ap_entries = this.collect_returned_ap_entries(
      ctx,
      solution,
      number_of_solved_args,
      []
    )

    let result_core = target_core
    for (const entry of returned_ap_entries) {
      const arg_core = readback(ctx, entry.arg_t, entry.returned_arg)
      result_core = new Exps.ReturnedApCore(result_core, arg_core)
    }

    const arg_core_entries = this.check_arg_entries(
      ctx,
      drop_returned_pi(
        ctx,
        new Exps.ReturnedPiValue(this.arg_t, this.ret_t_cl),
        returned_ap_entries
      ),
      arg_entries
    )

    for (const arg_core_entry of arg_core_entries) {
      result_core = wrap_arg_core_entry(result_core, arg_core_entry)
    }

    return result_core
  }

  private collect_returned_ap_entries(
    ctx: Ctx,
    solution: Solution,
    number_of_solved_args: number,
    entries: Array<ReturnedApEntry>
  ): Array<ReturnedApEntry> {
    if (entries.length === number_of_solved_args) {
      return entries
    }

    const entry = this.returned_ap_entry(ctx, solution)
    const ret_t = this.ret_t_cl.apply(entry.returned_arg)

    if (ret_t instanceof Exps.ReturnedPiValue) {
      return ret_t.returned_inserter.collect_returned_ap_entries(
        ctx,
        solution,
        number_of_solved_args,
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
      if (
        pi instanceof Exps.PiValue ||
        (pi instanceof Exps.ImplicitPiValue && arg_entry.kind === "implicit")
      ) {
        const arg_core = check(ctx, arg_entry.arg, pi.arg_t)
        const arg_value = evaluate(ctx.to_env(), arg_core)
        arg_core_entries.push({
          kind: arg_entry.kind,
          arg: arg_core,
        })
        pi = pi.ret_t_cl.apply(arg_value)
      } else if (pi instanceof Exps.ImplicitPiValue) {
        const inferred_arg = infer(ctx, arg_entry.arg)
        const arg_core = inferred_arg.core
        const arg_value = evaluate(ctx.to_env(), arg_core)
        const { entries, ret_t_cl } =
          pi.implicit_inserter.collect_implicit_ap_entries(
            ctx,
            inferred_arg.t,
            []
          )
        for (const implicit_ap_entry of entries) {
          arg_core_entries.push({
            kind: "implicit",
            arg: readback(
              ctx,
              implicit_ap_entry.arg_t,
              implicit_ap_entry.implicit_arg
            ),
          })
        }
        arg_core_entries.push({
          kind: arg_entry.kind,
          arg: arg_core,
        })
        pi = ret_t_cl.apply(arg_value)
      } else {
        throw new ExpTrace(
          [
            `I expect pi to be Exps.PiValue or Exps.ImplicitPiValue`,
            `  class name: ${pi.constructor.name}`,
            `  arg_entry.kind: ${arg_entry.kind}`,
            `  arg_entry.arg: ${arg_entry.arg.format()}`,
          ].join("\n")
        )
      }
    }

    return arg_core_entries
  }
}

function solve_returned_args(
  ctx: Ctx,
  ret_t: Value,
  t: Value,
  number_of_solved_args: number = 0
): { solution: Solution; number_of_solved_args: number } {
  if (
    ret_t instanceof Exps.ReturnedPiValue ||
    ret_t instanceof Exps.ImplicitPiValue ||
    ret_t instanceof Exps.PiValue
  ) {
    // NOTE if the given type is also a returned pi, we can also handle it,
    //   because we try each possible case during unification.
    const solution = Solution.empty.unify(ctx, new Exps.TypeValue(), ret_t, t)
    if (Solution.failure_p(solution)) {
      const fresh_name = ctx.freshen(ret_t.ret_t_cl.name)
      const variable = new Exps.VarNeutral(fresh_name)
      const not_yet_value = new Exps.NotYetValue(ret_t.arg_t, variable)
      const next_ret_t = ret_t.ret_t_cl.apply(not_yet_value)
      return solve_returned_args(ctx, next_ret_t, t, number_of_solved_args + 1)
    } else {
      return { solution, number_of_solved_args }
    }
  } else {
    const solution = Solution.empty.unify_or_fail(
      ctx,
      new Exps.TypeValue(),
      ret_t,
      t
    )

    return { solution, number_of_solved_args }
  }
}

function drop_returned_pi(
  ctx: Ctx,
  ret_t: Value,
  returned_ap_entries: Array<ReturnedApEntry>
): Value {
  if (ret_t instanceof Exps.ReturnedPiValue && returned_ap_entries.length > 0) {
    const [entry, ...rest] = returned_ap_entries
    const next_ret_t = ret_t.ret_t_cl.apply(entry.returned_arg)
    return drop_returned_pi(ctx, next_ret_t, rest)
  } else {
    return ret_t
  }
}

function wrap_arg_core_entry(
  target_core: Core,
  arg_core_entry: Exps.ArgCoreEntry
): Core {
  switch (arg_core_entry.kind) {
    case "implicit": {
      return new Exps.ImplicitApCore(target_core, arg_core_entry.arg)
    }
    case "returned": {
      return new Exps.ReturnedApCore(target_core, arg_core_entry.arg)
    }
    case "plain": {
      return new Exps.ApCore(target_core, arg_core_entry.arg)
    }
  }
}
