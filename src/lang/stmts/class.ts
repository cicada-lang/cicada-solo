import { Stmt, StmtMeta, StmtOutput } from "../stmt"
import { Module } from "../../module"
import { infer } from "../exp"
import * as Exps from "../exps"

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
    const exp = new Exps.The(new Exps.Type(), this.cls, this.cls.meta)
    mod.extendInferred(this.name, infer(mod.ctx, exp))
    return undefined
  }

  format(): string {
    return `let ${this.name} = ${this.cls.format()}`
  }
}
