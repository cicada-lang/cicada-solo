import pt from "@cicada-lang/partech"
import { Stmt } from "../../stmt"
import * as Stmts from "../../stmts"
import * as Exps from "../../exps"
import {
  exp_matcher,
  operator_matcher,
  operand_matcher,
  cls_entry_matcher,
  pi_handler,
  bindings_matcher,
} from "../matchers"

export function stmts_matcher(tree: pt.Tree): Array<Stmt> {
  return pt.matcher({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree): Stmt {
  return pt.matcher<Stmt>({
    "stmt:def": ({ name, exp }) =>
      new Stmts.Def(pt.str(name), exp_matcher(exp)),
    "stmt:def_the": ({ name, t, exp }) =>
      new Stmts.Def(
        pt.str(name),
        new Exps.The(exp_matcher(t), exp_matcher(exp))
      ),
    "stmt:def_the_flower_bracket": ({ name, t, exp }) =>
      new Stmts.Def(
        pt.str(name),
        new Exps.The(exp_matcher(t), exp_matcher(exp))
      ),
    "stmt:def_fn": ({ name, bindings, ret_t, ret }) => {
      const fn = bindings_matcher(bindings)
        .reverse()
        .reduce((result, binding) => {
          switch (binding.kind) {
            case "named": {
              return new Exps.Fn(binding.name, result)
            }
            case "implicit": {
              if (!(result instanceof Exps.Fn)) {
                throw new Error(
                  [
                    `When reducing implicit names,`,
                    `I expects the result to be Exps.Fn`,
                    `  class name: ${result.constructor.name}`,
                  ].join("\n")
                )
              }
              return new Exps.ImFn(
                [
                  ...binding.entries.map(({ name }) => ({
                    field_name: name,
                    local_name: name,
                  })),
                  {
                    field_name: binding.last_entry.name,
                    local_name: binding.last_entry.name,
                  },
                ],
                result
              )
            }
          }
        }, exp_matcher(ret))

      return new Stmts.Def(
        pt.str(name),
        new Exps.The(pi_handler({ bindings, ret_t }), fn)
      )
    },
    "stmt:show_operator": ({ operator }, { span }) =>
      new Stmts.Show(operator_matcher(operator), { span }),
    "stmt:show_operand": ({ operand }, { span }) =>
      new Stmts.Show(operand_matcher(operand), { span }),
    "stmt:class": ({ name, entries }) =>
      new Stmts.Class(
        pt.str(name),
        pt.matchers
          .zero_or_more_matcher(entries)
          .map(cls_entry_matcher)
          .reverse()
          .reduce(
            (rest_t, entry) =>
              new Exps.ConsCls(
                entry.field_name,
                entry.field_name,
                entry.field_t,
                rest_t
              ),
            new Exps.NilCls()
          )
      ),
    "stmt:class_extends": ({ name, parent, entries }) =>
      new Stmts.ClassExtends(
        pt.str(name),
        new Exps.Ext(
          operator_matcher(parent),
          pt.matchers
            .zero_or_more_matcher(entries)
            .map(cls_entry_matcher)
            .reverse()
            .reduce(
              (rest_t, entry) =>
                new Exps.ConsCls(
                  entry.field_name,
                  entry.field_name,
                  entry.field_t,
                  rest_t
                ),
              new Exps.NilCls()
            )
        )
      ),
    "stmt:import": ({ path, entries }, { span }) => {
      return new Stmts.Import(
        pt.trim_boundary(pt.str(path), 1),
        pt.matchers.zero_or_more_matcher(entries).map(import_entry_matcher),
        { span }
      )
    },
  })(tree)
}

export function import_entry_matcher(tree: pt.Tree): Stmts.ImportEntry {
  return pt.matcher({
    "import_entry:name": ({ name }) => ({ name: pt.str(name) }),
    "import_entry:name_alias": ({ name, alias }) => ({
      name: pt.str(name),
      alias: pt.str(alias),
    }),
  })(tree)
}
