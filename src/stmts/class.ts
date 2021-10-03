import { Stmt } from "../stmt"
import { Module } from "../module"
import { infer } from "../exp"
import { evaluate } from "../core"
import * as Exps from "../exps"
import pt from "@cicada-lang/partech"

export class Class extends Stmt {
  name: string
  cls: Exps.Cls
  meta: { span: pt.Span }

  constructor(name: string, cls: Exps.Cls, meta: { span: pt.Span }) {
    super()
    this.name = name
    this.cls = cls
    this.meta = meta
  }

  async execute(mod: Module): Promise<void> {
    const exp = new Exps.The(new Exps.Type(), this.cls)
    const inferred = infer(mod.ctx, exp)
    const inferred_value = evaluate(mod.ctx.to_env(), inferred.core)
    mod.ctx.assert_not_redefine(this.name, inferred.t, inferred_value)
    mod.ctx = mod.ctx.extend(this.name, inferred.t, inferred_value)
    mod.env = mod.env.extend(this.name, evaluate(mod.env, inferred.core))
  }

  repr(): string {
    return `${this.name} = ${this.cls.repr()}`
  }
}
