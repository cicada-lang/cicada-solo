export type Stack<A> = {
  stack: Array<A>
  push: (value: A) => Stack<A>
  drop: () => Stack<A>
  tos: () => A
  pop: () => [A, Stack<A>]
}

export function Stack<A>(stack: Array<A>): Stack<A> {
  return {
    stack,
    push: (value) => Stack([value, ...stack]),
    drop: () => Stack(stack.slice(1)),
    tos: () => stack[0],
    pop: () => [stack[0], Stack(stack.slice(1))],
  }
}
