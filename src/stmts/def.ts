import { Stmt } from "../stmt"
import { Module } from "../module"
import { Exp } from "../exp"
import * as Cores from "../cores"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import { readback } from "../readback"
import { Trace } from "../trace"

export class Def implements Stmt {
  name: string
  exp: Exp

  constructor(name: string, exp: Exp) {
    this.name = name
    this.exp = exp
  }

  async execute(mod: Module): Promise<void> {
    const inferred = infer(mod.ctx, this.exp)
    const old_t = mod.ctx.lookup_type(this.name)
    if (old_t) {
      const old_t_repr = readback(mod.ctx, new Cores.TypeValue(), old_t).repr()
      const t_repr = readback(mod.ctx, new Cores.TypeValue(), inferred.t).repr()
      throw new Trace(
        [
          `I can not re-define name:`,
          `  ${this.name}`,
          `to a value of type:`,
          `  ${old_t_repr}`,
          `It is already define to a value of type:`,
          `  ${t_repr}`,
        ].join("\n")
      )
    }

    mod.ctx = mod.ctx.extend(
      this.name,
      inferred.t,
      evaluate(mod.ctx.to_env(), inferred.core)
    )
    mod.env = mod.env.extend(this.name, evaluate(mod.env, inferred.core))
    mod.enter(this)
  }
}
