import * as Exp from "../exp"
import * as Env from "../env"

export class Closure {
  env: Env.Env
  name: string
  body: Exp.Exp

  constructor(the: { env: Env.Env; name: string; body: Exp.Exp }) {
    this.env = the.env
    this.name = the.name
    this.body = the.body
  }
}
