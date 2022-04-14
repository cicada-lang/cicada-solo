import * as Exps from ".."
import * as ut from "../../../ut"
import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
import { check, Exp, infer } from "../../exp"
import { Solution } from "../../solution"
import { readback, Value } from "../../value"
import { Closure } from "../closure"

interface VagueApEntry {
  arg_t: Value
  vague_arg: Value
}

export class VagueInserter {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  insert_vague_fn(ctx: Ctx, exp: Exp): Core {
    const fresh_name = ut.freshen(
      exp.free_names(new Set()),
      ctx.freshen(this.ret_t_cl.name)
    )
    const variable = new Exps.VarNeutral(fresh_name)
    const arg = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = this.ret_t_cl.apply(arg)
    // NOTE We do not need to subst `exp` for the `fresh_name`,
    //   because inserted `fresh_name` must not occur in `exp`.
    const core = check(ctx.extend(fresh_name, this.arg_t), exp, ret_t)
    return new Exps.VagueFnCore(fresh_name, core)
  }

  insert_vague_ap(
    ctx: Ctx,
    target_core: Core,
    arg_entries: Array<Exps.ArgEntry>,
    t: Value
  ): Core {
    // NOTE The `number_of_solved_args` depends on the given type -- `t`,
    //   which might be a vague-pi type or pi type.
    //   i.e. not only,
    //       check! ...: ...
    //   but also,
    //       check! ...: (vague ...) -> ...
    const { solution, number_of_solved_args } = solve_vague_args(
      ctx,
      new Exps.VaguePiValue(this.arg_t, this.ret_t_cl),
      t
    )

    const vague_ap_entries = this.collect_vague_ap_entries(
      ctx,
      solution,
      number_of_solved_args,
      []
    )

    let result_core = target_core
    for (const entry of vague_ap_entries) {
      const arg_core = readback(ctx, entry.arg_t, entry.vague_arg)
      result_core = new Exps.VagueApCore(result_core, arg_core)
    }

    const arg_core_entries = check_arg_entries(
      ctx,
      drop_vague_pi(
        ctx,
        new Exps.VaguePiValue(this.arg_t, this.ret_t_cl),
        vague_ap_entries
      ),
      arg_entries
    )

    for (const arg_core_entry of arg_core_entries) {
      result_core = Exps.build_ap_from_arg_core_entry(
        result_core,
        arg_core_entry
      )
    }

    return result_core
  }

  private collect_vague_ap_entries(
    ctx: Ctx,
    solution: Solution,
    number_of_solved_args: number,
    entries: Array<VagueApEntry>
  ): Array<VagueApEntry> {
    if (entries.length === number_of_solved_args) {
      return entries
    }

    const entry = this.vague_ap_entry(ctx, solution)
    const ret_t = this.ret_t_cl.apply(entry.vague_arg)

    if (ret_t instanceof Exps.VaguePiValue) {
      return ret_t.vague_inserter.collect_vague_ap_entries(
        ctx,
        solution,
        number_of_solved_args,
        [...entries, entry]
      )
    } else {
      return [...entries, entry]
    }
  }

  private vague_ap_entry(ctx: Ctx, solution: Solution): VagueApEntry {
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const vague_arg = solution.find(fresh_name)
    if (vague_arg === undefined) {
      throw new ExpTrace(
        [
          `Fail to find ${fresh_name} in solution`,
          `  solution names: ${solution.names}`,
          `  this.arg_t class name: ${this.arg_t.constructor.name}`,
        ].join("\n")
      )
    }

    return { arg_t: this.arg_t, vague_arg }
  }
}

function solve_vague_args(
  ctx: Ctx,
  ret_t: Value,
  t: Value,
  number_of_solved_args: number = 0
): { solution: Solution; number_of_solved_args: number } {
  if (
    ret_t instanceof Exps.VaguePiValue ||
    ret_t instanceof Exps.ImplicitPiValue ||
    ret_t instanceof Exps.PiValue
  ) {
    // NOTE if the given type is also a vague pi, we can also handle it,
    //   because we try each possible case during unification.
    const solution = Solution.empty.unify(ctx, new Exps.TypeValue(), ret_t, t)
    if (Solution.failure_p(solution)) {
      const fresh_name = ctx.freshen(ret_t.ret_t_cl.name)
      const variable = new Exps.VarNeutral(fresh_name)
      const not_yet_value = new Exps.NotYetValue(ret_t.arg_t, variable)
      const next_ret_t = ret_t.ret_t_cl.apply(not_yet_value)
      return solve_vague_args(ctx, next_ret_t, t, number_of_solved_args + 1)
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

function drop_vague_pi(
  ctx: Ctx,
  ret_t: Value,
  vague_ap_entries: Array<VagueApEntry>
): Value {
  if (ret_t instanceof Exps.VaguePiValue && vague_ap_entries.length > 0) {
    const [entry, ...rest] = vague_ap_entries
    const next_ret_t = ret_t.ret_t_cl.apply(entry.vague_arg)
    return drop_vague_pi(ctx, next_ret_t, rest)
  } else {
    return ret_t
  }
}

function check_arg_entries(
  ctx: Ctx,
  t: Value,
  arg_entries: Array<Exps.ArgEntry>
): Array<Exps.ArgCoreEntry> {
  const arg_core_entries: Array<Exps.ArgCoreEntry> = []
  for (const arg_entry of arg_entries) {
    const result = check_arg_entry(ctx, t, arg_entry)
    arg_core_entries.push(...result.arg_core_entries)
    t = result.t
  }

  return arg_core_entries
}

function check_arg_entry(
  ctx: Ctx,
  t: Value,
  arg_entry: Exps.ArgEntry
): { arg_core_entries: Array<Exps.ArgCoreEntry>; t: Value } {
  if (
    t instanceof Exps.PiValue ||
    (t instanceof Exps.ImplicitPiValue && arg_entry.kind === "implicit")
  ) {
    const arg_core = check(ctx, arg_entry.exp, t.arg_t)
    const arg_value = evaluate(ctx.to_env(), arg_core)
    return {
      arg_core_entries: [{ kind: arg_entry.kind, core: arg_core }],
      t: t.ret_t_cl.apply(arg_value),
    }
  } else if (t instanceof Exps.ImplicitPiValue) {
    const inferred_arg = infer(ctx, arg_entry.exp)
    const arg_core = inferred_arg.core
    const arg_value = evaluate(ctx.to_env(), arg_core)
    const result = t.implicit_inserter.collect_implicit_ap_entries(
      ctx,
      inferred_arg.t,
      []
    )
    return {
      arg_core_entries: [
        ...result.entries.map((implicit_ap_entry) => ({
          kind: "implicit" as const,
          core: readback(
            ctx,
            implicit_ap_entry.arg_t,
            implicit_ap_entry.implicit_arg
          ),
        })),
        { kind: arg_entry.kind, core: arg_core },
      ],
      t: result.ret_t_cl.apply(arg_value),
    }
  } else {
    throw new ExpTrace(
      [
        `I expect pi to be Exps.PiValue or Exps.ImplicitPiValue`,
        `  class name: ${t.constructor.name}`,
        `  arg_entry.kind: ${arg_entry.kind}`,
        `  arg_entry.arg: ${arg_entry.exp.format()}`,
      ].join("\n")
    )
  }
}
