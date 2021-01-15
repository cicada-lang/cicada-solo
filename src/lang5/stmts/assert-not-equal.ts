import { Stmt } from "../stmt"
import { World } from "../world"
import { JoJo } from "../jos/jojo"
import * as ut from "../../ut"

export type AssertNotEqual = Stmt & {
  left: JoJo
  right: JoJo
}

export function AssertNotEqual(left: JoJo, right: JoJo): AssertNotEqual {
  return {
    left,
    right,
    // TODO
    execute: (world) => world,
  }
}
