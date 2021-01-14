export type Stack<A> = {
  empty_p: () => boolean
  push: (value: A) => Stack<A>
  drop: () => Stack<A>
  tos: () => A
  pop: () => [A, Stack<A>]
}
