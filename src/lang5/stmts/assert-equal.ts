import { Stmt } from "../stmt"
import { World } from "../world"
import { JoJo } from "../jos/jojo"
import * as ut from "../../ut"

export type AssertEqual = Stmt & {
  left: JoJo
  right: JoJo
}

export function AssertEqual(left: JoJo, right: JoJo): AssertEqual {
  return {
    left,
    right,
    // TODO
    execute: (world) => world,
  }
}
