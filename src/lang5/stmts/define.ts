import { Stmt } from "../stmt"
import { World } from "../world"
import { value_equal } from "../value"
import { JoJo } from "../jos/jojo"
import * as ut from "../../ut"

export type Define = Stmt & {
  name: string
  jojo: JoJo
}

export function Define(name: string, jojo: JoJo): Define {
  return {
    name,
    jojo,
    assemble: (world) => world.mod_extend(name, jojo),
  }
}
