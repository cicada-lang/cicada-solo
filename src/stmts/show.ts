import { Stmt } from "../stmt"
import { Module } from "../module"
import { Exp } from "../exp"
import { infer } from "../exp"
import { evaluate } from "../core"
import { readback } from "../value"
import * as Exps from "../exps"
import * as StmtOutputs from "../stmt-outputs"
import pt from "@cicada-lang/partech"

export class Show extends Stmt {
  exp: Exp
  meta: { span: pt.Span }

  constructor(exp: Exp, meta: { span: pt.Span }) {
    super()
    this.exp = exp
    this.meta = meta
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
