import { Stmt } from "../stmt"
import { Module } from "../module"
import { Exp } from "../exp"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import { The, Type, TypeValue, Cls, Ext } from "../exps"

export class Class implements Stmt {
  name: string
  t: Cls | Ext

  constructor(name: string, t: Cls | Ext) {
    this.name = name
    this.t = t
    this.t.name = this.name
  }

  async execute(mod: Module): Promise<void> {
    const exp = new The(new Type(), this.t)
    const t = infer(mod.ctx, exp)
    const ctx = mod.ctx
    mod.ctx = mod.ctx.extend(this.name, t, evaluate(ctx, ctx.to_env(), exp))
    mod.env = mod.env.extend(this.name, t, evaluate(ctx, mod.env, exp))
  }
}
