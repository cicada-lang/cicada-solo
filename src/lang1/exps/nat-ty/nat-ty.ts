import { Repr } from "../../repr"

export type NatTy = Repr & {
  kind: "NatTy"
}

export const NatTy: NatTy = {
  kind: "NatTy",
  repr: () => "NatTy",
}
