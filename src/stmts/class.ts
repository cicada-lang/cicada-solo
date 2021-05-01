import { Stmt } from "../stmt"
import { Module } from "../module"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import * as Exps from "../exps"

export class Class implements Stmt {
  name: string
  t: Exps.Cls | Exps.Ext

  constructor(name: string, t: Exps.Cls | Exps.Ext) {
    this.name = name
    this.t = t
    this.t.name = this.name
  }

  async execute(mod: Module): Promise<void> {
    const exp = new Exps.The(new Exps.Type(), this.t)
    const t = infer(mod.ctx, exp)
    const ctx = mod.ctx
    mod.ctx = mod.ctx.extend(this.name, t, evaluate(ctx, ctx.to_env(), exp))
    mod.env = mod.env.extend(this.name, t, evaluate(ctx, mod.env, exp))
  }
}
