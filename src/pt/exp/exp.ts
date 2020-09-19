export type Exp = Terminal | NonTerminal
export type Terminal = lit
export type NonTerminal = v | ap

interface v {
  kind: "Exp.v"
  name: string
}

export const v = (name: string): v => ({
  kind: "Exp.v",
  name,
})

interface ap {
  kind: "Exp.ap"
  target: Exp
  args: Array<Exp>
  main: NonTerminal
}

export const ap = (target: Exp, args: Array<Exp>, main: NonTerminal): ap => ({
  kind: "Exp.ap",
  target,
  args,
  main,
})

interface lit {
  kind: "Exp.lit"
  value: string
}

export const lit = (value: string): lit => ({
  kind: "Exp.lit",
  value,
})
