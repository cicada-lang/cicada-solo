import { Stmt, StmtMeta, StmtOutput } from "../stmt"
import { Module } from "../../module"
import { infer } from "../exp"

import { Exp } from "../exp"
import * as Exps from "../exps"

export class Datatype extends Stmt {
  meta: StmtMeta
  name: string
  datatype: Exps.TypeCtor

  constructor(
    name: string,
    fixed: Record<string, Exp>,
    indexes: Record<string, Exp>,
    ctors: Record<string, Exp>,
    meta: StmtMeta
  ) {
    super()
    this.meta = meta
    this.name = name
    this.datatype = new Exps.TypeCtor(name, fixed, indexes, ctors)
  }

  async execute(mod: Module): Promise<StmtOutput | undefined> {
    mod.extendInferred(this.name, infer(mod.ctx, this.datatype))
    return undefined
  }

  format(): string {
    return this.datatype.format()
  }
}
