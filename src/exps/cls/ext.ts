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
      free_names = new Set([...free_names, ...entry.free_names(bound_names)])
      bound_names = new Set([...bound_names, entry.local_name])
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

    return {
      t: new Cores.TypeValue(),
      core: new Cores.Cls(
        [...parent_core.entries, ...infer_entries(ctx, entries)],
        { name: this.name }
      ),
    }
  }

  repr(): string {
    const name = this.name || ""

    if (this.entries.length === 0) {
      return `class ${name} {}`
    }

    const entries = this.entries.map((entry) => entry.repr()).join("\n")
    const body = `{\n${ut.indent(entries, "  ")}\n}`
    return `class ${name} extends ${this.parent_name} ${body}`
  }
}

function infer_entries(
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
    ...infer_entries(
      ctx.extend(fresh_name, t_value),
      Exps.ClsEntry.subst_entries(rest, local_name, new Exps.Var(fresh_name))
    ),
  ]
}
