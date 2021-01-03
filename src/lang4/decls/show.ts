import { Decl } from "../decl"
import { World } from "../world"
import { JoJo } from "../jos/jojo"
import * as ut from "../../ut"

export type Show = Decl & {
  jojo: JoJo
}

export function Show(jojo: JoJo): Show {
  return {
    jojo,
    assemble: (world) => world,
    check: (world) => jojo.jos_cut(world),
    output: (world) =>
      "[ " +
      [...jojo.jos_compose(world).values]
        .reverse()
        .map((value) => value.repr())
        .join(" ") +
      " ]" +
      "\n",
  }
}
