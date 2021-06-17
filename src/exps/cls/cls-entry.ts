import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
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

  private subst(name: string, exp: Exp, local_name?: string): ClsEntry {
    return new ClsEntry(
      this.field_name,
      this.t.subst(name, exp),
      this.exp?.subst(name, exp),
      local_name || this.local_name
    )
  }

  static subst_entries(
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
      rest = ClsEntry.subst_entries(rest, entry.local_name, v)
      rest = ClsEntry.subst_entries(rest, name, exp)
      return [entry.subst(name, exp, fresh_name), ...rest]
    }
  }

  static infer_entries(
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
      new Cores.ClsEntry(field_name, t_core, exp_core),
      ...ClsEntry.infer_entries(
        ctx.extend(fresh_name, t_value),
        Exps.ClsEntry.subst_entries(rest, local_name, new Exps.Var(fresh_name))
      ),
    ]
  }
}
