import * as Tree from "../tree"
import * as Span from "../span"
import * as ut from "../../ut"

export function matcher<A>(choices: {
  [key: string]: (
    body: Tree.Body,
    opts: { head: Tree.Head; span: Span.Span }
  ) => A
}): (tree: Tree.Tree) => A {
  return (tree) => {
    if (tree.kind === "Tree.node") {
      const { body, head } = tree
      const span = Tree.span(tree)
      const key = `${head.name}:${head.kind}`
      const f = choices[key]
      if (f) {
        return f(body, { head, span })
      } else {
        throw new Error("Tree.matcher fail\n" + `key mismatch: ${key}\n`)
      }
    } else {
      throw new Error(
        "Expecting Tree.node\n" +
          `Tree.matcher can only match on node\n` +
          `but found leaf: ${ut.inspect(tree)}\n`
      )
    }
  }
}
