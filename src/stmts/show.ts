import { Stmt } from "../stmt"
import { Module } from "../module"
import { Exp } from "../exp"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import { readback } from "../readback"
import * as Cores from "../cores"

export class Show implements Stmt {
  exp: Exp

  constructor(exp: Exp) {
    this.exp = exp
  }

  async execute(mod: Module): Promise<void> {
    const inferred = infer(mod.ctx, this.exp)
    const t = inferred.t
    const value = evaluate(mod.env, inferred.core)
    const value_repr = readback(mod.ctx, t, value).repr()
    const t_repr = readback(mod.ctx, new Cores.TypeValue(), t).repr()
    mod.output += `@the ${t_repr} ${value_repr}\n`
  }
}
