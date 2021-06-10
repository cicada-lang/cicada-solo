import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Cls extends Exp {
  entries: Array<{ name: string; t: Exp; exp?: Exp }>
  name?: string

  constructor(
    entries: Array<{ name: string; t: Exp; exp?: Exp }>,
    opts?: { name?: string }
  ) {
    super()
    this.entries = entries
    this.name = opts?.name
  }

  private subst_entries(
    name: string,
    exp: Exp
  ): Array<{ name: string; t: Exp; exp?: Exp }> {
    const entries: Array<{ name: string; t: Exp; exp?: Exp }> = new Array()
    let occured: boolean = false

    for (const entry of this.entries) {
      if (occured) {
        entries.push(entry)
      } else if (name === entry.name) {
        entries.push({
          name: entry.name,
          t: entry.t.subst(name, exp),
          exp: entry.exp,
        })
        occured = true
      } else {
        entries.push({
          name: entry.name,
          t: entry.t.subst(name, exp),
          exp: entry.exp?.subst(name, exp),
        })
      }
    }

    return entries
  }

  subst(name: string, exp: Exp): Exp {
    return new Cls(this.subst_entries(name, exp), { name: this.name })
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const entries: Array<{ name: string; t: Core; exp?: Core }> = new Array()

    for (const { name, t, exp } of this.entries) {
      const t_core = check(ctx, t, new Cores.TypeValue())
      const t_value = evaluate(ctx.to_env(), t_core)
      const exp_core = exp ? check(ctx, exp, t_value) : undefined
      entries.push({ name, t: t_core, exp: exp_core })
      ctx = ctx.extend(name, t_value)
    }

    return {
      t: new Cores.TypeValue(),
      core: new Cores.Cls(entries, { name: this.name }),
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
