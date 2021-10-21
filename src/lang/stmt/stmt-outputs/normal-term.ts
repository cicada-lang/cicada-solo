import { StmtOutput } from "../stmt-output"
import { Core } from "../../core"

export class NormalTerm extends StmtOutput {
  exp: Core
  t: Core

  constructor(opts: { exp: Core; t: Core }) {
    super()
    this.exp = opts.exp
    this.t = opts.t
  }

  repr(): string {
    return `${this.exp.repr()}: ${this.t.repr()}`
  }
}
