import { Stmt } from "@/stmt"
import { World } from "@/world"
import { Exp } from "@/exp"
import { infer } from "@/infer"
import { evaluate } from "@/evaluate"
import { The, Type, Cls } from "@/core"

export class Class implements Stmt {
  name: string
  cls: Cls

  constructor(name: string, cls: Cls) {
    this.name = name
    this.cls = cls
    this.cls.name = this.name
  }

  execute(world: World): World {
    const exp = new The(new Type(), this.cls)

    return world
      .ctx_extend(
        this.name,
        infer(world.ctx, exp),
        evaluate(world.ctx.to_env(), exp)
      )
      .env_extend(this.name, evaluate(world.env, exp))
  }
}
