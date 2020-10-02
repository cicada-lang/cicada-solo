import * as Exp from "../exp"
import * as pt from "../../partech"

const exp_matcher = pt.Tree.matcher<Exp.Exp>({
  "exp:var": ({ name }) => Exp.v(pt.Tree.match_leaf(name).value),
  // "exp:fn": ({ name, body }) => [
  //   '"("',
  //   { name: "identifier" },
  //   '")"',
  //   '"="',
  //   '">"',
  //   { body: "exp" },
  // ],
  // "exp:ap": [
  //   { target: "identifier" },
  //   { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
  // ],
  // "exp:suite": [
  //   '"{"',
  //   { defs: { $ap: ["zero_or_more", "def"] } },
  //   { ret: "exp" },
  //   '"}"',
  // ]
})

export const from_tree = exp_matcher
