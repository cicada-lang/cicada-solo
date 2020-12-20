import { Repr } from "../../repr"
import { Ty } from "../../ty"

export type NatTy = Repr & {
  kind: "NatTy"
}

export const NatTy: NatTy = {
  kind: "NatTy",
  repr: () => "NatTy",
}

export function is_nat_ty(t: Ty): t is NatTy {
  return t.kind === "NatTy"
}

export function as_nat_ty(t: Ty): NatTy {
  if (is_nat_ty(t)) return t
  throw new Error("Expecting NatTy")
}
