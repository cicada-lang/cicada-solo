import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { readback } from "../../readback"
import { Trace } from "../../trace"
import * as Cores from "../../cores"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class Ext extends Exp {
  name?: string
  parent_name: string
  entries: Array<Exps.ClsEntry>

  constructor(
    parent_name: string,
    entries: Array<Exps.ClsEntry>,
    opts?: { name?: string }
  ) {
    super()
    this.parent_name = parent_name
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
    return new Ext(
      this.parent_name,
      Exps.ClsEntry.subst_entries(this.entries, name, exp),
      {
        name: this.name,
      }
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const parent = evaluate(ctx.to_env(), new Cores.Var(this.parent_name))

    if (!(parent instanceof Cores.ClsValue)) {
      throw new Trace(`Expecting parent to be ClsValue`)
    }

    ctx = parent.extend_ctx(ctx)

    const parent_core = readback(ctx, new Cores.TypeValue(), parent)

    if (!(parent_core instanceof Cores.Cls)) {
      throw new Trace(`Expecting parent_core to be Cls`)
    }

    const entries = Exps.ClsEntry.subst_entries(
      this.entries,
      "super",
      new Exps.Obj(
        parent.names.map((name) => new Exps.FieldShorthandProp(name))
      )
    )

    const core_entries: Array<Cores.ClsEntry> = new Array()
    const renaming: Array<[string, string]> = new Array()

    for (const entry of entries) {
      const { name, t, exp } = renaming.reduce(
        (entry, [name, fresh_name]) =>
          entry.subst(name, new Exps.Var(fresh_name)),
        entry
      )

      const fresh_name = ut.freshen_name(new Set(ctx.names), name)
      const t_core = check(ctx, t, new Cores.TypeValue())
      const t_value = evaluate(ctx.to_env(), t_core)
      const exp_core = exp ? check(ctx, exp, t_value) : undefined
      core_entries.push(new Cores.ClsEntry(name, t_core, exp_core))
      ctx = ctx.extend(fresh_name, t_value)

      renaming.push([name, fresh_name])
    }

    return {
      t: new Cores.TypeValue(),
      core: new Cores.Cls([...parent_core.entries, ...core_entries], {
        name: this.name,
      }),
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
    const body = `{\n${ut.indent(s, "  ")}\n}`
    return `class ${name} extends ${this.parent_name} ${body}`
  }
}
