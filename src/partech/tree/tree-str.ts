import * as Tree from "../tree"
import * as Span from "../span"
import * as Token from "../token"
import * as ut from "../../ut"

export function str(tree: Tree.Tree): string {
  return Tree.token(tree).value
}
