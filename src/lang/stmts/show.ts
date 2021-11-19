import { Stmt, StmtMeta, StmtOutput } from "../stmt"
import { Module } from "../../module"
import { Exp } from "../exp"
import { infer } from "../exp"
import { evaluate } from "../core"
import { readback } from "../value"
import * as Exps from "../exps"
import * as StmtOutputs from "../stmt/stmt-outputs"

export class Show extends Stmt {
  meta: StmtMeta
  exp: Exp

  constructor(exp: Exp, meta: StmtMeta) {
    super()
    this.meta = meta
    this.exp = exp
  }

  async execute(mod: Module): Promise<StmtOutput | undefined> {
    const inferred = infer(mod.ctx, this.exp)
    const inferred_value = evaluate(mod.env, inferred.core)
    return new StmtOutputs.NormalTerm({
      exp: readback(mod.ctx, inferred.t, inferred_value),
      t: readback(mod.ctx, new Exps.TypeValue(), inferred.t),
    })
  }

  format(): string {
    return this.exp.format()
  }
}
