import * as Exp from "../exp"
import * as Pattern from "../pattern"
import * as Top from "../top"
import * as Stmt from "../stmt"
import * as pt from "../../partech"
import * as ut from "../../ut"

export function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher<Exp.Exp>({
    "exp:var": ({ name }) => Exp.v(pt.Tree.str(name)),
    "exp:pi": ({ name, arg_t, ret_t }) =>
      Exp.pi(pt.Tree.str(name), exp_matcher(arg_t), exp_matcher(ret_t)),
    "exp:arrow": ({ arg_t, ret_t }) =>
      Exp.pi("_", exp_matcher(arg_t), exp_matcher(ret_t)),
    "exp:fn": ({ pattern, body }) =>
      Exp.fn(pattern_matcher(pattern), exp_matcher(body)),
    "exp:ap": ({ target, args }) => {
      let exp: Exp.Exp = Exp.v(pt.Tree.str(target))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        exp = Exp.ap(exp, exp_matcher(arg))
      }
      return exp
    },
    "exp:cls": ({ sat, scope }) =>
      Exp.cls(sat_matcher(sat), scope_matcher(scope)),
    "exp:obj": ({ properties }) => Exp.obj(properties_matcher(properties)),
    "exp:field": ({ target, name }) =>
      Exp.dot(exp_matcher(target), pt.Tree.str(name)),
    "exp:method": ({ target, name, args }) => {
      let exp: Exp.Exp = Exp.dot(exp_matcher(target), pt.Tree.str(name))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        exp = Exp.ap(exp, exp_matcher(arg))
      }
      return exp
    },
    "exp:equal": ({ t, from, to }) =>
      Exp.equal(exp_matcher(t), exp_matcher(from), exp_matcher(to)),
    "exp:same": () => Exp.same,
    "exp:replace": ({ target, motive, base }) =>
      Exp.replace(exp_matcher(target), exp_matcher(motive), exp_matcher(base)),
    "exp:absurd": () => Exp.absurd,
    "exp:absurd_ind": ({ target, motive }) =>
      Exp.absurd_ind(exp_matcher(target), exp_matcher(motive)),
    "exp:str": () => Exp.str,
    "exp:quote": ({ value }) => {
      const str = pt.Tree.str(value)
      return Exp.quote(str.slice(1, str.length - 1))
    },
    "exp:union": ({ head, tail }) => {
      let exp: Exp.Exp = exp_matcher(head)
      for (const right of pt.matchers.zero_or_more_matcher(tail)) {
        exp = Exp.union(exp, exp_matcher(right))
      }
      return exp
    },
    "exp:type": () => Exp.type,
    "exp:object": () => Exp.cls([], []),
    "exp:begin": ({ stmts, ret }) =>
      Exp.begin(stmts_matcher(stmts), exp_matcher(ret)),
    "exp:deduction": ({ deduction_entries, deduction_args }) => {
      const entries = pt.matchers
        .one_or_more_matcher(deduction_entries)
        .map(deduction_entry_matcher)
      const args = pt.matchers
        .zero_or_more_matcher(deduction_args)
        .map(exp_matcher)
      return deduction_aux(entries, args)
    },
  })(tree)
}

function pattern_matcher(tree: pt.Tree.Tree): Pattern.Pattern {
  return pt.Tree.matcher<Pattern.Pattern>({
    // NOTE The rule is "if OneCap must be ALL_CAPS"
    "pattern:v": ({ name }) => Pattern.v(pt.Tree.str(name)),
    "pattern:datatype": ({ name, args }) =>
      Pattern.datatype(
        pt.Tree.str(name),
        pt.matchers.one_or_more_matcher(args).map(pattern_matcher)
      ),
    "pattern:data": ({ name, tag, args }) =>
      Pattern.data(
        pt.Tree.str(name),
        pt.Tree.str(tag),
        pt.matchers.one_or_more_matcher(args).map(pattern_matcher)
      ),
  })(tree)
}

function deduction_aux(
  entries: Array<{ t: Exp.Exp; exp: Exp.Exp }>,
  args: Array<Exp.Exp>
): Exp.Exp {
  if (entries.length === 0) {
    throw new Error("entries.length === 0")
  } else if (entries.length === 1) {
    let [{ t, exp }] = entries
    if (args.length === 0) return Exp.the(t, exp)
    for (const arg of args) exp = Exp.ap(exp, arg)
    return Exp.the(t, exp)
  } else {
    const [{ t, exp }, ...rest] = entries
    const arg = deduction_aux(entries.slice(1), args)
    return Exp.the(t, Exp.ap(exp, arg))
  }
}

export function deduction_entry_matcher(
  tree: pt.Tree.Tree
): { t: Exp.Exp; exp: Exp.Exp } {
  return pt.Tree.matcher<{ t: Exp.Exp; exp: Exp.Exp }>({
    "deduction_entry:deduction_entry": ({ t, exp }) => ({
      t: exp_matcher(t),
      exp: exp_matcher(exp),
    }),
  })(tree)
}

export function tops_matcher(tree: pt.Tree.Tree): Array<Top.Top> {
  return pt.Tree.matcher<Array<Top.Top>>({
    "tops:tops": ({ tops }) =>
      pt.matchers.zero_or_more_matcher(tops).map(top_matcher),
  })(tree)
}

export function top_matcher(tree: pt.Tree.Tree): Top.Top {
  return pt.Tree.matcher<Top.Top>({
    "top:def": ({ name, exp }) =>
      Top.def(pt.Tree.str(name), undefined, exp_matcher(exp)),
    "top:claim": ({ claim, t, define, exp }, { span }) => {
      if (pt.Tree.str(claim) !== pt.Tree.str(define)) {
        throw new pt.ParsingError(
          "Name mismatch.\n" +
            `- name to claim  : ${pt.Tree.str(claim)}\n` +
            `- name to define : ${pt.Tree.str(define)}\n`,
          { span }
        )
      }
      return Top.def(pt.Tree.str(claim), exp_matcher(t), exp_matcher(exp))
    },
    "top:show": ({ exp }) => Top.show(exp_matcher(exp)),
    "top:datatype": ({ name, t, sums }) =>
      Top.type_constructor(
        Exp.type_constructor(
          pt.Tree.str(name),
          exp_matcher(t),
          sums_matcher(sums)
        )
      ),
  })(tree)
}

export function sums_matcher(
  tree: pt.Tree.Tree
): Array<{ tag: string; t: Exp.Exp }> {
  return pt.Tree.matcher<Array<{ tag: string; t: Exp.Exp }>>({
    "sums:sums": ({ sums }) =>
      pt.matchers.zero_or_more_matcher(sums).map(sum_entry_matcher),
  })(tree)
}

export function sum_entry_matcher(
  tree: pt.Tree.Tree
): { tag: string; t: Exp.Exp } {
  return pt.Tree.matcher<{ tag: string; t: Exp.Exp }>({
    "sum_entry:sum_entry": ({ tag, t }) => ({
      tag: pt.Tree.str(tag),
      t: exp_matcher(t),
    }),
  })(tree)
}

export function stmts_matcher(tree: pt.Tree.Tree): Array<Stmt.Stmt> {
  return pt.Tree.matcher<Array<Stmt.Stmt>>({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree.Tree): Stmt.Stmt {
  return pt.Tree.matcher<Stmt.Stmt>({
    "stmt:def": ({ name, exp }) =>
      Stmt.def(pt.Tree.str(name), exp_matcher(exp)),
    "stmt:claim": ({ claim, t, define, exp }, { span }) => {
      if (pt.Tree.str(claim) !== pt.Tree.str(define)) {
        throw new pt.ParsingError(
          "Name mismatch.\n" +
            `- name to claim  : ${pt.Tree.str(claim)}\n` +
            `- name to define : ${pt.Tree.str(define)}\n`,
          { span }
        )
      }
      return Stmt.def(
        pt.Tree.str(claim),
        Exp.the(exp_matcher(t), exp_matcher(exp))
      )
    },
  })(tree)
}

export function properties_matcher(tree: pt.Tree.Tree): Map<string, Exp.Exp> {
  return pt.Tree.matcher<Map<string, Exp.Exp>>({
    "properties:properties": ({ properties }) =>
      new Map(
        pt.matchers.zero_or_more_matcher(properties).map(property_matcher)
      ),
  })(tree)
}

export function property_matcher(tree: pt.Tree.Tree): [string, Exp.Exp] {
  return pt.Tree.matcher<[string, Exp.Exp]>({
    "property:property": ({ name, exp }) => [
      pt.Tree.str(name),
      exp_matcher(exp),
    ],
  })(tree)
}

export function sat_matcher(
  tree: pt.Tree.Tree
): Array<{ name: string; t: Exp.Exp; exp: Exp.Exp }> {
  return pt.Tree.matcher<Array<{ name: string; t: Exp.Exp; exp: Exp.Exp }>>({
    "sat:sat": ({ entries }) =>
      pt.matchers.zero_or_more_matcher(entries).map(sat_entry_matcher),
  })(tree)
}

export function sat_entry_matcher(
  tree: pt.Tree.Tree
): { name: string; t: Exp.Exp; exp: Exp.Exp } {
  return pt.Tree.matcher<{ name: string; t: Exp.Exp; exp: Exp.Exp }>({
    "sat_entry:sat_entry": ({ name, t, exp }) => ({
      name: pt.Tree.str(name),
      t: exp_matcher(t),
      exp: exp_matcher(exp),
    }),
  })(tree)
}

export function scope_matcher(
  tree: pt.Tree.Tree
): Array<{ name: string; t: Exp.Exp }> {
  return pt.Tree.matcher<Array<{ name: string; t: Exp.Exp }>>({
    "scope:scope": ({ entries }) =>
      pt.matchers.one_or_more_matcher(entries).map(scope_entry_matcher),
  })(tree)
}

export function scope_entry_matcher(
  tree: pt.Tree.Tree
): { name: string; t: Exp.Exp } {
  return pt.Tree.matcher<{ name: string; t: Exp.Exp }>({
    "scope_entry:scope_entry": ({ name, t }) => ({
      name: pt.Tree.str(name),
      t: exp_matcher(t),
    }),
  })(tree)
}
