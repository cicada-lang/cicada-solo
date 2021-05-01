import { Stmt } from "../stmt"
import { Module } from "../module"
import { Exp } from "../exp"
import { infer } from "../infer"
import { evaluate } from "../evaluate"

export class Def implements Stmt {
  name: string
  exp: Exp

  constructor(name: string, exp: Exp) {
    this.name = name
    this.exp = exp
  }

  async execute(mod: Module): Promise<void> {
    const inferred = infer(mod.ctx, this.exp)
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
