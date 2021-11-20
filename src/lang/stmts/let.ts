import { Stmt, StmtMeta, StmtOutput } from "../stmt"
import { Module } from "../../module"
import { Exp } from "../exp"
import { infer } from "../exp"

export class Let extends Stmt {
  meta: StmtMeta
  name: string
  exp: Exp

  constructor(name: string, exp: Exp, meta: StmtMeta) {
    super()
    this.meta = meta
    this.name = name
    this.exp = exp
  }

  async execute(mod: Module): Promise<StmtOutput | undefined> {
    mod.extendInferred(this.name, infer(mod.ctx, this.exp))
    return undefined
  }

  format(): string {
    return `let ${this.name} = ${this.exp.format()}`
  }
}
