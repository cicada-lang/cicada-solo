import { PossibleWorlds } from "../possible-worlds"

export type Cuttable = {
  cuttability: (possible_worlds: PossibleWorlds) => PossibleWorlds
}
