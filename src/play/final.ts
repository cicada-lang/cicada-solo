export type Den<Exp> = {
  lit(n: number): Exp
  neg(x: Exp): Exp
  add(x: Exp, y: Exp): Exp
}

function tf1<Exp>(den: Den<Exp>): Exp {
  return den.add(den.lit(8), den.neg(den.add(den.lit(1), den.lit(2))))
}
