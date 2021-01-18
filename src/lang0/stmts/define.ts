import { Stmt } from "../stmt"
import { Exp } from "../exp"
import { evaluate } from "../evaluate"

export type Define = Stmt & {
  kind: "Define"
  name: string
  exp: Exp
}

export function Define(name: string, exp: Exp): Define {
  return {
    kind: "Define",
    name, exp,
    execute(world) {
      return world.env_extend(name, evaluate(world.env, exp))
    }
  }
}
