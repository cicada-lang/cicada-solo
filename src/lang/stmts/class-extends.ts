import { Module } from "../../module"
import { infer } from "../exp"
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
    const exp = new Exps.The(new Exps.Type(), this.ext, this.ext.meta)
    mod.extendInferred(this.name, infer(mod.ctx, exp))
    return undefined
  }

  format(): string {
    return `let ${this.name} = ${this.ext.format()}`
  }
}
