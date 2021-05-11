import { Stmt } from "../stmt"
import { Module } from "../module"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import * as Exps from "../exps"

export class Class implements Stmt {
  name: string
  t: Exps.Cls | Exps.Ext
  super_name?: string

  constructor(
    name: string,
    t: Exps.Cls | Exps.Ext,
    opts?: {
      super_name?: string
    }
  ) {
    this.name = name
    this.t = t
    this.t.name = this.name
    this.super_name = opts?.super_name
  }

  async execute(mod: Module): Promise<void> {
    const exp = new Exps.The(new Exps.Type(), this.t)
    const inferred = infer(mod.ctx, exp)
    const t = inferred.t
    const ctx = mod.ctx
    mod.ctx = mod.ctx.extend(
      this.name,
      t,
      evaluate(ctx.to_env(), inferred.core)
    )
    mod.env = mod.env.extend(this.name, evaluate(mod.env, inferred.core))
  }
}
