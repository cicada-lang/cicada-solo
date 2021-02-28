import { Env } from "@/env"
import { Ctx } from "@/ctx"
import { Value } from "@/value"
import { Stmt } from "@/stmt"

export class World {
  env: Env
  ctx: Ctx
  output: string

  constructor(the?: { env?: Env; ctx?: Ctx; output?: string }) {
    this.env = the?.env || new Env()
    this.ctx = the?.ctx || new Ctx()
    this.output = the?.output || ""
  }

  env_extend(name: string, value: Value): World {
    return new World({
      ...this,
      env: this.env.extend(name, value),
    })
  }

  ctx_extend(name: string, t: Value, value?: Value): World {
    return new World({
      ...this,
      ctx: this.ctx.extend(name, t, value),
    })
  }

  output_append(str: string): World {
    return new World({
      ...this,
      output: this.output + str,
    })
  }

  run_stmts(stmts: Array<Stmt>): World {
    let world: World = this
    for (const stmt of stmts) {
      world = stmt.execute(world)
    }

    return world
  }
}
