import pt from "@cicada-lang/partech"
import { Stmt } from "../../stmt"
import * as Stmts from "../../stmts"
import { Exp } from "../../exp"
import * as Exps from "../../exps"
import {
  exp_matcher,
  operator_matcher,
  operand_matcher,
  cls_entry_matcher,
  pi_handler,
  bindings_matcher,
  simple_bindings_matcher,
} from "../matchers"

export function stmts_matcher(tree: pt.Tree): Array<Stmt> {
  return pt.matcher({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree): Stmt {
  return pt.matcher<Stmt>({
    "stmt:def": ({ name, exp }, { span }) =>
      new Stmts.Def(pt.str(name), exp_matcher(exp), { span }),
    "stmt:def_the": ({ name, t, exp }, { span }) =>
      new Stmts.Def(
        pt.str(name),
        new Exps.The(exp_matcher(t), exp_matcher(exp), {
          span: pt.span_closure([t.span, exp.span]),
        }),
        { span }
      ),
    "stmt:def_the_flower_bracket": ({ name, t, exp }, { span }) =>
      new Stmts.Def(
        pt.str(name),
        new Exps.The(exp_matcher(t), exp_matcher(exp), {
          span: pt.span_closure([t.span, exp.span]),
        }),
        { span }
      ),
    "stmt:def_fn": ({ name, bindings, ret_t, ret }, { span }) => {
      const fn = bindings_matcher(bindings)
        .reverse()
        .reduce((result, binding) => {
          switch (binding.kind) {
            case "named": {
              return new Exps.Fn(binding.name, result, {
                span: pt.span_closure([binding.span, ret.span]),
              })
            }
            case "implicit": {
              if (!(result instanceof Exps.Fn)) {
                throw new pt.ParsingError(
                  [
                    `When reducing implicit names,`,
                    `I expects the result to be Exps.Fn`,
                    `  class name: ${result.constructor.name}`,
                  ].join("\n"),
                  { span: binding.span }
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
                result,
                {
                  span: pt.span_closure([binding.span, ret.span]),
                }
              )
            }
          }
        }, exp_matcher(ret))
      return new Stmts.Def(
        pt.str(name),
        new Exps.The(pi_handler({ bindings, ret_t }, { span }), fn, {
          span: pt.span_closure([bindings.span, ret_t.span, ret.span]),
        }),
        { span }
      )
    },
    "stmt:show_operator": ({ operator }, { span }) =>
      new Stmts.Show(operator_matcher(operator), { span }),
    "stmt:show_operand": ({ operand }, { span }) =>
      new Stmts.Show(operand_matcher(operand), { span }),
    "stmt:class": ({ name, entries }, { span }) =>
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
                rest_t,
                { span: entry.span }
              ),
            new Exps.NilCls({ span })
          ),
        { span }
      ),
    "stmt:class_extends": ({ name, parent, entries }, { span }) =>
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
                  rest_t,
                  { span: entry.span }
                ),
              new Exps.NilCls({ span })
            ),
          { span }
        ),
        { span }
      ),
    "stmt:import": ({ path, entries }, { span }) => {
      return new Stmts.Import(
        pt.trim_boundary(pt.str(path), 1),
        pt.matchers.zero_or_more_matcher(entries).map(import_entry_matcher),
        { span }
      )
    },
    "stmt:datatype": ({ name, ctors }, { span }) => {
      return new Stmts.Datatype(
        pt.str(name),
        {},
        {},
        Object.fromEntries(
          pt.matchers
            .one_or_more_matcher(ctors)
            .map(ctor_matcher)
            .map(({ name, t }) => [name, t])
        ),
        { span }
      )
    },
    "stmt:datatype_parameters": ({ name, parameters, ctors }, { span }) => {
      return new Stmts.Datatype(
        pt.str(name),
        Object.fromEntries(
          simple_bindings_matcher(parameters).map(({ name, exp }) => [
            name,
            exp,
          ])
        ),
        {},
        Object.fromEntries(
          pt.matchers
            .one_or_more_matcher(ctors)
            .map(ctor_matcher)
            .map(({ name, t }) => [name, t])
        ),
        { span }
      )
    },
    "stmt:datatype_parameters_indexes": (
      { name, parameters, indexes, ctors },
      { span }
    ) => {
      return new Stmts.Datatype(
        pt.str(name),
        Object.fromEntries(
          simple_bindings_matcher(parameters).map(({ name, exp }) => [
            name,
            exp,
          ])
        ),
        Object.fromEntries(
          simple_bindings_matcher(indexes).map(({ name, exp }) => [name, exp])
        ),
        Object.fromEntries(
          pt.matchers
            .one_or_more_matcher(ctors)
            .map(ctor_matcher)
            .map(({ name, t }) => [name, t])
        ),
        { span }
      )
    },
    "stmt:datatype_indexes": ({ name, indexes, ctors }, { span }) => {
      return new Stmts.Datatype(
        pt.str(name),
        {},
        Object.fromEntries(
          simple_bindings_matcher(indexes).map(({ name, exp }) => [name, exp])
        ),
        Object.fromEntries(
          pt.matchers
            .one_or_more_matcher(ctors)
            .map(ctor_matcher)
            .map(({ name, t }) => [name, t])
        ),
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

export function ctor_matcher(tree: pt.Tree): {
  name: string
  t: Exp
  span: pt.Span
} {
  return pt.matcher({
    "ctor:field": ({ name, t }, { span }) => ({
      name: pt.str(name),
      t: exp_matcher(t),
      span,
    }),
    "ctor:method": ({ name, bindings, ret_t }, { span }) => ({
      name: pt.str(name),
      t: pi_handler({ bindings, ret_t }, { span }),
      span,
    }),
  })(tree)
}
