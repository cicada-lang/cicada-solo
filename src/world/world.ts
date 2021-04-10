import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"
import { Stmt } from "../stmt"

export class World {
  env: Env
  ctx: Ctx
  output: string

  constructor(the?: { env?: Env; ctx?: Ctx; output?: string }) {
    this.env = the?.env || new Env()
    this.ctx = the?.ctx || new Ctx()
    this.output = the?.output || ""
  }
}
