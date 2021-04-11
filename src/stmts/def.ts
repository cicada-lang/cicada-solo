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
    const exp = this.exp
    mod.ctx = mod.ctx.extend(
      this.name,
      infer(mod.ctx, exp),
      evaluate(mod.ctx.to_env(), exp)
    )
    mod.env = mod.env.extend(this.name, evaluate(mod.env, exp))
  }
}
