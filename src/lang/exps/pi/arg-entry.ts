import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"

export type ArgEntry = {
  kind: "plain" | "implicit" | "vague"
  arg: Exp
}

export type ArgCoreEntry = {
  kind: "plain" | "implicit" | "vague"
  arg: Core
}

export type ArgValueEntry = {
  kind: "plain" | "implicit" | "vague"
  arg: Value
}
