export type Stack<A> = {
  depth: () => number
  push: (value: A) => Stack<A>
  drop: () => Stack<A>
  top: () => A
  pop: () => [A, Stack<A>]
  repr: (value_repr: (value: A) => string) => string
}
