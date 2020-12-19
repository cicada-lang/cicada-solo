import { Repr } from "../../repr"

export type Nat = Repr & {
  kind: "Ty.nat"
}

export const Nat: Nat = {
  kind: "Ty.nat",
  repr: () => "Nat",
}
