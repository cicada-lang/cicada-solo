import { Stmt, StmtMeta, StmtOutput } from "../stmt"
import { Module } from "../../module"
import { Exp } from "../exp"
import { infer } from "../exp"
import { evaluate } from "../core"
import * as Errors from "../errors"

export class Def extends Stmt {
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
    const inferred = infer(mod.ctx, this.exp)
    mod.extendInferred(this.name, infer(mod.ctx, this.exp))
    return undefined
  }

  repr(): string {
    return `${this.name} = ${this.exp.repr()}`
  }
}
