import { Stmt } from "../stmt"
import { World } from "../world"
import { Exp } from "../exp"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import { The, Type, TypeValue, Cls, Ext } from "../core"

export class Class implements Stmt {
  name: string
  t: Cls | Ext

  constructor(name: string, t: Cls | Ext) {
    this.name = name
    this.t = t
    this.t.name = this.name
  }

  async execute(world: World): Promise<World> {
    const t = new The(new Type(), this.t)

    return world
      .ctx_extend(this.name, new TypeValue(), evaluate(world.ctx.to_env(), t))
      .env_extend(this.name, evaluate(world.env, t))
  }
}
