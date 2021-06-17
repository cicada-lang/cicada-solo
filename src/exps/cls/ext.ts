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
        [...parent_core.entries, ...Exps.ClsEntry.infer_entries(ctx, entries)],
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
