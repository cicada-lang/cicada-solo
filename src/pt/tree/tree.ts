import { Obj } from "../../ut"

export type Tree = node | leaf

interface Head {
  name: string
  kind: string
}

type Body = Obj<Tree>

interface node {
  kind: "Tree.node"
  head: Head
  body: Body
}

export const node = (head: Head, body: Body): node => ({
  kind: "Tree.node",
  head,
  body,
})

interface Token {
  kind: string
  value: string
}

interface leaf {
  kind: "Tree.leaf"
  token: Token
}

export const leaf = (token: Token): leaf => ({
  kind: "Tree.leaf",
  token,
})
