import * as Tree from "../tree"

export function one_or_more_matcher<A>(tree: Tree.Tree): Array<Tree.Tree> {
  return Tree.matcher<Array<Tree.Tree>>({
    "one_or_more:one": ({ value }) => [value],
    "one_or_more:more": ({ head, tail }) => [
      head,
      ...one_or_more_matcher(tail),
    ],
  })(tree)
}
