import { Obj } from "../../ut"
import * as Token from "../token"
import * as Span from "../span"

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
  span: Span.Span
}

export const node = (head: Head, body: Body, span: Span.Span): node => ({
  kind: "Tree.node",
  head,
  body,
  span,
})

export interface leaf {
  kind: "Tree.leaf"
  token: Token.Token
}

export const leaf = (token: Token.Token): leaf => ({
  kind: "Tree.leaf",
  token,
})
