export type Exp = v | fn | ap | suite

export interface v {
  kind: "Exp.v"
  name: string
}

export interface fn {
  kind: "Exp.fn"
  name: string
  body: Exp
}

export interface ap {
  kind: "Exp.ap"
  target: Exp
  arg: Exp
}

export interface suite {
  kind: "Exp.suite"
  defs: Array<{ name: string; exp: Exp }>
  body: Exp
}
