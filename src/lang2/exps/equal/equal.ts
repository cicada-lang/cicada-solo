import { Exp } from "../../exp"

export type Equal = {
  kind: "Exp.equal"
  t: Exp
  from: Exp
  to: Exp
}

export function Equal(t: Exp, from: Exp, to: Exp): Equal {
  return {
    kind: "Exp.equal",
    t,
    from,
    to,
  }
}
