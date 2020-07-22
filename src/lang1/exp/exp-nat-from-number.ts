import * as Exp from "../exp"

export function nat_from_number(n: number): Exp.Exp {
  if (n <= 0) {
    return { kind: "Exp.Zero" }
  } else {
    const almost = nat_from_number(n - 1)
    return { kind: "Exp.Add1", prev: almost }
  }
}
