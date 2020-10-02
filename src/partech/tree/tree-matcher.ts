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
        throw new Error(
          "Key mismatch.\n" +
            `- key: ${key}\n` +
            `- keys of choices: ${Object.keys(choices).join(", ")}\n`
        )
      }
    } else {
      throw new Error(
        "Expecting Tree.node.\n" +
          `Tree.matcher can only match on node.\n` +
          `- tree: ${ut.inspect(tree)}\n`
      )
    }
  }
}
