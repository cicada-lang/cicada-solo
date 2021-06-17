import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Trace } from "../../trace"
import * as Cores from "../../cores"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class ClsEntry {
  field_name: string
  local_name: string
  t: Exp
  exp?: Exp

  constructor(field_name: string, t: Exp, exp?: Exp, local_name?: string) {
    this.field_name = field_name
    this.t = t
    this.exp = exp
    this.local_name = local_name || field_name
  }

  repr(): string {
    return this.exp
      ? `${this.field_name}: ${this.t.repr()} = ${this.exp.repr()}`
      : `${this.field_name}: ${this.t.repr()}`
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.t.free_names(bound_names),
      ...(this.exp ? this.exp.free_names(bound_names) : []),
    ])
  }

  static entries_check_distinct_field_names(field_names: Array<string>): void {
    function recur(names: Array<string>): void {
      if (names.length === 0) return

      const [name, ...rest] = names
      if (rest.includes(name)) {
        throw new Trace(
          [
            `I found duplicated name:`,
            `  ${name}`,
            `in field_names:`,
            `  ${field_names.join(", ")}`,
          ].join("\n")
        )
      }

      return recur(rest)
    }

    return recur(field_names)
  }

  static entries_free_names(
    entries: Array<ClsEntry>,
    bound_names: Set<string>
  ): Set<string> {
    let free_names: Set<string> = new Set()

    for (const entry of entries) {
      free_names = new Set([...free_names, ...entry.free_names(bound_names)])
      bound_names = new Set([...bound_names, entry.local_name])
    }

    return free_names
  }

  private subst(name: string, exp: Exp, local_name?: string): ClsEntry {
    return new ClsEntry(
      this.field_name,
      this.t.subst(name, exp),
      this.exp?.subst(name, exp),
      local_name || this.local_name
    )
  }

  static entries_subst(
    entries: Array<ClsEntry>,
    name: string,
    exp: Exp
  ): Array<ClsEntry> {
    if (entries.length === 0) return []

    let [entry, ...rest] = entries
    if (name === entry.local_name) {
      return [entry.subst(name, exp), ...rest]
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen_name(free_names, entry.local_name)
      const v = new Exps.Var(fresh_name)
      rest = ClsEntry.entries_subst(rest, entry.local_name, v)
      rest = ClsEntry.entries_subst(rest, name, exp)
      return [entry.subst(name, exp, fresh_name), ...rest]
    }
  }

  static entries_infer(
    ctx: Ctx,
    entries: Array<Exps.ClsEntry>
  ): Array<Cores.ClsEntry> {
    if (entries.length === 0) return []

    const [entry, ...rest] = entries
    const { field_name, local_name, t, exp } = entry
    const fresh_name = ut.freshen_name(new Set(ctx.names), local_name)
    const t_core = check(ctx, t, new Cores.TypeValue())
    const t_value = evaluate(ctx.to_env(), t_core)
    const exp_core = exp ? check(ctx, exp, t_value) : undefined

    return [
      new Cores.ClsEntry(field_name, t_core, exp_core, local_name),
      ...ClsEntry.entries_infer(
        ctx.extend(fresh_name, t_value),
        Exps.ClsEntry.entries_subst(rest, local_name, new Exps.Var(fresh_name))
      ),
    ]
  }
}
