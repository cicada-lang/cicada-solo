import * as Tree from "../tree"

export function str(tree: Tree.Tree): string {
  return Tree.token(tree).value
}
