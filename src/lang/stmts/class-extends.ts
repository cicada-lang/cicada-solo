import { evaluate } from "../core"
import { check } from "../exp"
import * as Exps from "../exps"
import { Mod } from "../mod"
import { Stmt, StmtMeta, StmtOutput } from "../stmt"

export class ClassExtends extends Stmt {
  meta: StmtMeta
  name: string
  ext: Exps.Ext

  constructor(name: string, ext: Exps.Ext, meta: StmtMeta) {
    super()
    this.meta = meta
    this.name = name
    this.ext = ext
  }

  async execute(mod: Mod): Promise<StmtOutput | void> {
    const t = new Exps.TypeValue()
    const core = check(mod.ctx, this.ext, t)
    const value = evaluate(mod.env, core)
    mod.define(this.name, t, value)
  }

  undo(mod: Mod): void {
    mod.delete(this.name)
  }

  format(): string {
    return `let ${this.name} = ${this.ext.format()}`
  }
}
