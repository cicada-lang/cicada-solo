import * as Tree from "../tree"
import * as Span from "../span"

export function span(tree: Tree.Tree): Span.Span {
  switch (tree.kind) {
    case "Tree.node": {
      return tree.span
    }
    case "Tree.leaf": {
      const { token } = tree
      return token.span
    }
  }
}
