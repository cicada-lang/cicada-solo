import { Stmt } from "../stmt"
import { Module } from "../module"
import { Exp } from "../exp"
import { infer } from "../exp"
import { evaluate } from "../core"
import { Trace } from "../errors"

export class Def extends Stmt {
  name: string
  exp: Exp

  constructor(name: string, exp: Exp) {
    super()
    this.name = name
    this.exp = exp
  }

  async execute(mod: Module): Promise<void> {
    const inferred = infer(mod.ctx, this.exp)
    const inferred_value = evaluate(mod.ctx.to_env(), inferred.core)
    mod.ctx.assert_not_redefine(this.name, inferred.t, inferred_value)
    mod.ctx = mod.ctx.extend(this.name, inferred.t, inferred_value)
    mod.env = mod.env.extend(this.name, evaluate(mod.env, inferred.core))
  }

  repr(): string {
    return `${this.name} = ${this.exp.repr()}`
  }
}
