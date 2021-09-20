import { Stmt } from "../stmt"
import { Module } from "../module"
import { Exp } from "../exp"
import { infer } from "../exp"
import { evaluate } from "../core"
import { readback } from "../value"
import * as Exps from "../exps"

export class Show extends Stmt {
  exp: Exp

  constructor(exp: Exp) {
    super()
    this.exp = exp
  }

  async execute(mod: Module): Promise<void> {
    const inferred = infer(mod.ctx, this.exp)
    const t = inferred.t
    const value = evaluate(mod.env, inferred.core)
    const value_repr = readback(mod.ctx, t, value).repr()
    const t_repr = readback(mod.ctx, new Exps.TypeValue(), t).repr()
    const output = `${value_repr}: ${t_repr} `
    mod.output(output)
  }

  repr(): string {
    return this.exp.repr()
  }
}
