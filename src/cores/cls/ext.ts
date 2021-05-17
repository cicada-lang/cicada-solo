import { Core, AlphaCtx } from "../../core"
import { Value, match_value } from "../../value"
import { Env } from "../../env"
import { Telescope } from "../../telescope"
import { evaluate } from "../../evaluate"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Ext extends Core {
  name?: string
  parent_name: string
  entries: Array<{ name: string; t: Core; exp?: Core }>

  constructor(
    parent_name: string,
    entries: Array<{ name: string; t: Core; exp?: Core }>,
    opts?: { name?: string }
  ) {
    super()
    this.parent_name = parent_name
    this.entries = entries
    this.name = opts?.name
  }

  evaluate(env: Env): Value {
    const parent = evaluate(env, new Cores.Var(this.parent_name))

    return match_value(parent, [
      [
        Cores.ClsValue,
        (cls: Cores.ClsValue) =>
          new Cores.ExtValue(cls, new Telescope(env, this.entries), {
            name: this.name,
          }),
      ],
      [
        Cores.ExtValue,
        (ext: Cores.ExtValue) =>
          new Cores.ExtValue(ext, new Telescope(env, this.entries), {
            name: this.name,
          }),
      ],
    ])
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

  alpha_repr(ctx: AlphaCtx): string {
    throw new Trace(
      `ExtValue should be readback to Cls,\n` +
        `thus ExtValue.alpha_repr should never be called.`
    )
  }
}
