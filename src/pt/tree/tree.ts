import { Obj } from "../../ut"
import * as Token from "../token"

export type Tree = node | leaf

export interface Head {
  name: string
  kind: string
}

export type Body = Obj<Tree>

export interface node {
  kind: "Tree.node"
  head: Head
  body: Body
}

export const node = (head: Head, body: Body): node => ({
  kind: "Tree.node",
  head,
  body,
})

export interface leaf {
  kind: "Tree.leaf"
  token: Token.Token
}

export const leaf = (token: Token.Token): leaf => ({
  kind: "Tree.leaf",
  token,
})
