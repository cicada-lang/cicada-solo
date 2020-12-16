import { PossibleWorlds } from "../possible-worlds"

export type Value = {
  comeout(worlds: PossibleWorlds): PossibleWorlds
}
