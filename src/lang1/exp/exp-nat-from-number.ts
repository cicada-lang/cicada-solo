import * as Exp from "../exp"

export function nat_from_number(n: number): Exp.Exp {
  if (n <= 0) {
    return { kind: "Exp.zero" }
  } else {
    const almost = nat_from_number(n - 1)
    return { kind: "Exp.add1", prev: almost }
  }
}
