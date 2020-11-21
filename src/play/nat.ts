export type Nat<Exp> = {
  zero: Exp
  add1: (prev: Exp) => Exp
}

function add<Exp>(nat: Nat<Exp>): (x: Exp, y: Exp) => Exp {
  throw new Error()
}
