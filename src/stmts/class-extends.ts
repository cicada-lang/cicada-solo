import { Stmt } from "../stmt"
import { Module } from "../module"
import { infer } from "../exp"
import { evaluate } from "../core"
import * as Sem from "../sem"

export class ClassExtends implements Stmt {
  name: string
  ext: Sem.Ext

  constructor(name: string, ext: Sem.Ext) {
    this.name = name
    this.ext = ext
  }

  async execute(mod: Module): Promise<void> {
    const exp = new Sem.The(new Sem.Type(), this.ext)
    const inferred = infer(mod.ctx, exp)
    const inferred_value = evaluate(mod.ctx.to_env(), inferred.core)
    mod.ctx.assert_not_redefine(this.name, inferred.t, inferred_value)
    mod.ctx = mod.ctx.extend(this.name, inferred.t, inferred_value)
    mod.env = mod.env.extend(this.name, evaluate(mod.env, inferred.core))
    mod.enter(this)
  }
}
