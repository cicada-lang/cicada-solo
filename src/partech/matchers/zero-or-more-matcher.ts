import * as Tree from "../tree"

export function zero_or_more_matcher<A>(tree: Tree.Tree): Array<Tree.Tree> {
  return Tree.matcher<Array<Tree.Tree>>({
    "zero_or_more:zero": ({ value }) => [],
    "zero_or_more:more": ({ head, tail }) => [
      head,
      ...zero_or_more_matcher(tail),
    ],
  })(tree)
}
