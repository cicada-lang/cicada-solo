import { Stmt, StmtMeta } from "../stmt"
import { Module } from "../module"
import { Exp } from "../exp"
import { infer } from "../exp"
import { evaluate } from "../core"
import { readback } from "../value"
import * as Exps from "../exps"
import * as StmtOutputs from "../stmt-outputs"

export class Show extends Stmt {
  meta: StmtMeta
  exp: Exp

  constructor(exp: Exp, meta: StmtMeta) {
    super()
    this.meta = meta
    this.exp = exp
  }

  async execute(mod: Module): Promise<void> {
    const inferred = infer(mod.ctx, this.exp)
    const t = inferred.t
    const value = evaluate(mod.env, inferred.core)

    mod.output(
      new StmtOutputs.NormalTerm({
        exp: readback(mod.ctx, t, value),
        t: readback(mod.ctx, new Exps.TypeValue(), t),
      })
    )
  }

  repr(): string {
    return this.exp.repr()
  }
}
