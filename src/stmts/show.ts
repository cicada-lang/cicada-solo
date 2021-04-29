import { Stmt } from "../stmt"
import { Module } from "../module"
import { Exp } from "../exp"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import { readback } from "../readback"
import { TypeValue } from "../core"

export class Show implements Stmt {
  exp: Exp

  constructor(exp: Exp) {
    this.exp = exp
  }

  async execute(mod: Module): Promise<void> {
    const t = infer(mod.ctx, this.exp)
    const value = evaluate(mod.ctx, mod.env, this.exp)
    const value_repr = readback(mod.ctx, t, value).repr()
    const t_repr = readback(mod.ctx, new TypeValue(), t).repr()
    mod.output += `@the ${t_repr} ${value_repr}\n`
  }
}
