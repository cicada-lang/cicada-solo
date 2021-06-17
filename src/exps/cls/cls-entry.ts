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

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.t.free_names(bound_names),
      ...(this.exp ? this.exp.free_names(bound_names) : []),
    ])
  }

  subst(name: string, exp: Exp): ClsEntry {
    return new ClsEntry(
      this.field_name,
      this.t.subst(name, exp),
      this.exp?.subst(name, exp),
      this.local_name
    )
  }

  static subst_entries(
    origin_entries: Array<ClsEntry>,
    name: string,
    exp: Exp
  ): Array<ClsEntry> {
    if (origin_entries.length === 0) {
      return origin_entries
    }

    const [entry, ...tail] = origin_entries
    if (name === entry.local_name) {
      return [entry.subst(name, exp), ...tail]
    } else {
      return [entry.subst(name, exp), ...ClsEntry.subst_entries(tail, name, exp)]
    }
  }

  repr(): string {
    return this.exp
      ? `${this.field_name}: ${this.t.repr()} = ${this.exp.repr()}`
      : `${this.field_name}: ${this.t.repr()}`
  }
}
