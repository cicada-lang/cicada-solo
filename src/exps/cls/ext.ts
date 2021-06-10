import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { readback } from "../../readback"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import * as Cores from "../../cores"
import * as Exps from "../../exps"

export class Ext extends Exp {
  name?: string
  parent_name: string
  entries: Array<{ name: string; t: Exp; exp?: Exp }>

  constructor(
    parent_name: string,
    entries: Array<{ name: string; t: Exp; exp?: Exp }>,
    opts?: { name?: string }
  ) {
    super()
    this.parent_name = parent_name
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
    return new Ext(this.parent_name, this.subst_entries(name, exp), {
      name: this.name,
    })
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

    const entries = this.subst_entries(
      "super",
      new Exps.Obj(
        parent.names.map((name) => new Exps.FieldShorthandProp(name))
      )
    )

    const core_entries: Array<{
      name: string
      t: Core
      exp?: Core
    }> = new Array()
    for (const { name, t, exp } of entries) {
      const t_core = check(ctx, t, new Cores.TypeValue())
      const t_value = evaluate(ctx.to_env(), t_core)
      const exp_core = exp ? check(ctx, exp, t_value) : undefined
      core_entries.push({ name, t: t_core, exp: exp_core })
      ctx = ctx.extend(name, t_value)
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
