export type Stack<A> = {
  empty_p: () => boolean
  push: (value: A) => Stack<A>
  drop: () => Stack<A>
  top: () => A
  pop: () => [A, Stack<A>]
}
