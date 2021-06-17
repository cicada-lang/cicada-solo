import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import * as Cores from "../../cores"
import * as Exps from "../../exps"
import * as ut from "../../ut"
import { ClsEntry } from "./cls-entry"

export { ClsEntry } from "./cls-entry"

export class Cls extends Exp {
  entries: Array<ClsEntry>
  name?: string

  constructor(entries: Array<ClsEntry>, opts?: { name?: string }) {
    super()
    this.entries = entries
    this.name = opts?.name
  }

  free_names(bound_names: Set<string>): Set<string> {
    let free_names: Set<string> = new Set()

    for (const entry of this.entries) {
      free_names = new Set([
        ...free_names,
        ...entry.t.free_names(bound_names),
        ...(entry.exp ? entry.exp.free_names(bound_names) : []),
      ])
      bound_names = new Set([...bound_names, entry.name])
    }

    return free_names
  }

  subst(name: string, exp: Exp): Exp {
    return new Cls(ClsEntry.subst_entries(this.entries, name, exp), {
      name: this.name,
    })
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const core_entries: Array<{
      name: string
      t: Core
      exp?: Core
    }> = new Array()
    const renaming: Array<[string, string]> = new Array()

    for (let entry of this.entries) {
      const { name, t, exp } = renaming.reduce(
        (entry, [name, fresh_name]) =>
          entry.subst(name, new Exps.Var(fresh_name)),
        entry
      )

      const fresh_name = ut.freshen_name(new Set(ctx.names), name)
      const t_core = check(ctx, t, new Cores.TypeValue())
      const t_value = evaluate(ctx.to_env(), t_core)
      const exp_core = exp ? check(ctx, exp, t_value) : undefined
      core_entries.push({ name, t: t_core, exp: exp_core })
      ctx = ctx.extend(fresh_name, t_value)

      renaming.push([name, fresh_name])
    }

    return {
      t: new Cores.TypeValue(),
      core: new Cores.Cls(core_entries, { name: this.name }),
    }
  }

  repr(): string {
    const name = this.name || ""

    if (this.entries.length === 0) {
      return `class ${name} {}`
    }

    const entries = this.entries.map(({ name, t, exp }) => {
      return exp
        ? `${name}: ${t.repr()} = ${exp.repr()}`
        : `${name}: ${t.repr()}`
    })

    const s = entries.join("\n")

    return `class ${name} {\n${ut.indent(s, "  ")}\n}`
  }
}
