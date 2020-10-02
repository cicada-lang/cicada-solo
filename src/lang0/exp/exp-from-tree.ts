import * as Exp from "../exp"
import * as pt from "../../partech"

function exp_match(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher<Exp.Exp>({
    "exp:var": ({ name }) => Exp.v(pt.Tree.str(name)),
    "exp:fn": ({ name, body }) => Exp.fn(pt.Tree.str(name), exp_match(body)),
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
  })(tree)
}

export function from_tree(tree: pt.Tree.Tree): Exp.Exp {
  return exp_match(tree)
}
