import { Module } from "../../module"
import { check } from "../exp"
import * as Exps from "../exps"
import { Stmt, StmtMeta, StmtOutput } from "../stmt"

export class Class extends Stmt {
  meta: StmtMeta
  name: string
  cls: Exps.Cls

  constructor(name: string, cls: Exps.Cls, meta: StmtMeta) {
    super()
    this.meta = meta
    this.name = name
    this.cls = cls
  }

  async execute(mod: Module): Promise<StmtOutput | undefined> {
    const t = new Exps.TypeValue()
    const core = check(mod.ctx, this.cls, t)
    mod.extendInferred(this.name, { t, core })
    return undefined
  }

  format(): string {
    return `let ${this.name} = ${this.cls.format()}`
  }
}
