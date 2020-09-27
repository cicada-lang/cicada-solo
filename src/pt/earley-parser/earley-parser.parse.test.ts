import * as EarleyParser from "../earley-parser"
import * as TableLexer from "../table-lexer"
import * as Mod from "../mod"
import * as Tree from "../tree"
import * as ut from "../../ut"

const E = {
  "E:EQF": ["E", "Q", "F"],
  "E:F": ["F"],
}

const F = {
  "F:a": ['"a"'],
}

const Q = {
  "Q:+": ['"+"'],
  "Q:-": ['"-"'],
}

const one_or_more = {
  $fn: [
    "x",
    {
      "one_or_more:one": [{ value: "x" }],
      "one_or_more:more": [
        { head: "x" },
        { tail: { $ap: ["one_or_more", "x"] } },
      ],
    },
  ],
}

const S = {
  "S:S": [{ start: { $ap: ["one_or_more", '"("', "E", '")"'] } }],
}

export const mod = Mod.build({ E, F, Q, one_or_more, S })
export const grammar = Mod.dot(mod, "S")
export const parser = EarleyParser.create(grammar)
export const lexer = TableLexer.create([["char", /(.)/]])

function length_of_one_or_more(tree: Tree.Tree): number {
  if (tree.kind !== "Tree.node") {
    throw new Error("expecting Tree.node")
  }

  if (tree.head.kind === "one") {
    return 1
  } else if (tree.head.kind === "more") {
    return 1 + length_of_one_or_more(tree.body.tail)
  } else {
    throw new Error("expecting one_or_more")
  }
}

function assert_length(text: string, length: number): void {
  const tree = parser.parse(lexer.lex(text))
  if (tree.kind !== "Tree.node") {
    throw new Error("expecting Tree.node")
  }

  ut.assert_equal(length_of_one_or_more(tree.body.start), length)
}

assert_length("(a)", 1)
assert_length("(a)(a)", 2)
assert_length("(a)(a)(a)", 3)
assert_length("(a-a)", 1)
assert_length("(a-a+a)", 1)
assert_length("(a)(a)(a)(a)(a)(a)(a)(a)", 8)
assert_length("(a-a)(a-a)(a-a)", 3)
assert_length("(a-a+a)(a-a+a)(a-a+a)", 3)
assert_length("(a)(a-a)(a-a+a)", 3)
