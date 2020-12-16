import { PossibleWorlds } from "../possible-worlds"

export type Composable = {
  composability: (possible_worlds: PossibleWorlds) => PossibleWorlds
}
