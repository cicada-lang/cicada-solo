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
  name: string
  local_name: string
  t: Exp
  exp?: Exp

  constructor(name: string, t: Exp, exp?: Exp, local_name?: string) {
    this.name = name
    this.t = t
    this.exp = exp
    this.local_name = local_name || name
  }

  subst(name: string, exp: Exp): ClsEntry {
    return new ClsEntry(
      this.name,
      this.t.subst(name, exp),
      this.exp?.subst(name, exp)
    )
  }

  static subst_entries(
    origin_entries: Array<ClsEntry>,
    name: string,
    exp: Exp
  ): Array<ClsEntry> {
    const entries: Array<ClsEntry> = new Array()
    let occured: boolean = false

    for (const entry of origin_entries) {
      if (occured) {
        entries.push(entry)
      } else if (name === entry.name) {
        entries.push(entry.subst(name, exp))
        occured = true
      } else {
        entries.push(entry.subst(name, exp))
      }
    }

    return entries
  }

  repr(): string {
    return this.exp
      ? `${this.name}: ${this.t.repr()} = ${this.exp.repr()}`
      : `${this.name}: ${this.t.repr()}`
  }
}
