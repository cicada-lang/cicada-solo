export { ClsEntry } from "./cls-entry"

import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import * as Cores from "../../cores"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class Cls extends Exp {
  entries: Array<Exps.ClsEntry>
  name?: string

  constructor(entries: Array<Exps.ClsEntry>, opts?: { name?: string }) {
    super()
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
    return new Cls(Exps.ClsEntry.subst_entries(this.entries, name, exp), {
      name: this.name,
    })
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Cores.TypeValue(),
      core: new Cores.Cls(Exps.ClsEntry.infer_entries(ctx, this.entries), {
        name: this.name,
      }),
    }
  }

  repr(): string {
    const name = this.name || ""

    if (this.entries.length === 0) {
      return `class ${name} {}`
    }

    const entries = this.entries.map((entry) => entry.repr()).join("\n")
    return `class ${name} {\n${ut.indent(entries, "  ")}\n}`
  }
}
