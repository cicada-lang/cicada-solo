import { Stmt, StmtMeta, StmtOutput } from "../stmt"
import { Module } from "../../module"
import { infer } from "../exp"
import { evaluate } from "../core"
import { Exp } from "../exp"
import * as Exps from "../exps"

export class Datatype extends Stmt {
  meta: StmtMeta
  name: string
  datatype: Exps.Datatype

  constructor(
    name: string,
    parameters: Record<string, Exp>,
    indexes: Record<string, Exp>,
    ctors: Record<string, Exp>,
    meta: StmtMeta
  ) {
    super()
    this.meta = meta
    this.name = name
    this.datatype = new Exps.Datatype(name, parameters, indexes, ctors)
  }

  async execute(mod: Module): Promise<StmtOutput | undefined> {
    // TODO
    return undefined
  }

  repr(): string {
    return "TODO"
  }
}
