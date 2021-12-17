import { Module } from "../../module"
import { check } from "../exp"
import * as Exps from "../exps"
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

  async execute(mod: Module): Promise<StmtOutput | undefined> {
    const t = new Exps.TypeValue()
    const core = check(mod.ctx, this.ext, t)
    mod.extendTypedCore(this.name, { t, core })
    return undefined
  }

  format(): string {
    return `let ${this.name} = ${this.ext.format()}`
  }
}
