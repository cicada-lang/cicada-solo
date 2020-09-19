export type Exp = Terminal | NonTerminal
export type Terminal = str
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

interface str {
  kind: "Exp.str"
  value: string
}

export const str = (value: string): str => ({
  kind: "Exp.str",
  value,
})
