import * as Tree from "../tree"
import * as Span from "../span"
import * as Token from "../token"
import * as ut from "../../ut"

export function token(tree: Tree.Tree): Token.Token {
  if (tree.kind === "Tree.leaf") {
    const { token } = tree
    return token
  } else {
    throw new Error(
      "Expecting Tree.leaf.\n" +
        `- tree: ${ut.inspect(tree)}\n`
    )
  }
}
