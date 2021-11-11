import { Stmt, StmtMeta, StmtOutput } from "../stmt"
import { Module } from "../../module"
import { infer } from "../exp"
import { evaluate } from "../core"
import * as Exps from "../exps"

export class Datatype extends Stmt {
  meta: StmtMeta
  name: string
  datatype: Datatype

  constructor(meta: StmtMeta, name: string, datatype: Datatype) {
    super()
    this.meta = meta
    this.name = name
    this.datatype = datatype
  }

  async execute(mod: Module): Promise<StmtOutput | undefined> {
    throw new Error("TODO")
  }

  repr(): string {
    throw new Error("TODO")
  }
}
