import { Stmt, StmtMeta, StmtOutput } from "../stmt"
import { Module } from "../../module"
import { infer } from "../exp"
import { evaluate } from "../core"
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
    const inferred = infer(mod.ctx, exp)
    const inferred_value = evaluate(mod.ctx.to_env(), inferred.core)
    mod.ctx.assert_not_redefine(this.name, inferred.t, inferred_value)
    mod.ctx = mod.ctx.extend(this.name, inferred.t, inferred_value)
    mod.env = mod.env.extend(this.name, evaluate(mod.env, inferred.core))
    return undefined
  }

  repr(): string {
    return `${this.name} = ${this.cls.repr()}`
  }
}
