import { Stmt, StmtMeta, StmtOutput } from "../stmt"
import { Module } from "../../module"
import { infer } from "../exp"
import { evaluate } from "../core"
import * as Exps from "../exps"

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
    const inferred = infer(mod.ctx, exp)
    const inferred_value = evaluate(mod.ctx.to_env(), inferred.core)
    mod.ctx.assert_not_redefine(this.name, inferred.t, inferred_value)
    mod.ctx = mod.ctx.extend(this.name, inferred.t, inferred_value)
    mod.env = mod.env.extend(this.name, evaluate(mod.env, inferred.core))
    return undefined
  }

  repr(): string {
    return `${this.name} = ${this.ext.repr()}`
  }
}
