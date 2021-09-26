import pt from "@cicada-lang/partech"
import { Exp } from "../../exp"
import { nat_from_number } from "../../exps/nat/nat-util"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export function pi_handler(body: { [key: string]: pt.Tree }): Exp {
  const { bindings, ret_t } = body

  return bindings_matcher(bindings)
    .reverse()
    .reduce((result, binding) => {
      switch (binding.kind) {
        case "named": {
          return new Exps.Pi(binding.name, binding.exp, result)
        }
        case "implicit": {
          if (!(result instanceof Exps.Pi)) {
            throw new Error(
              [
                `When reducing implicit names,`,
                `I expects the result to be Exps.Pi`,
                `  class name: ${result.constructor.name}`,
              ].join("\n")
            )
          }

          return binding.entries
            .reverse()
            .reduce<Exps.ImPi>(
              (result, entry) =>
                new Exps.ConsImPi(entry.name, entry.name, entry.exp, result),
              new Exps.BaseImPi(
                binding.last_entry.name,
                binding.last_entry.name,
                binding.last_entry.exp,
                result
              )
            )
        }
      }
    }, exp_matcher(ret_t))
}

export function sigma_handler(body: { [key: string]: pt.Tree }): Exp {
  const { bindings, cdr_t } = body

  return bindings_matcher(bindings)
    .reverse()
    .reduce((result, binding) => {
      switch (binding.kind) {
        case "named": {
          return new Exps.Sigma(binding.name, binding.exp, result)
        }
        case "implicit": {
          throw new Error(`The "implicit" keyword should not be used in sigma`)
        }
      }
    }, exp_matcher(cdr_t))
}

export function exp_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "exp:operator": ({ operator }) => operator_matcher(operator),
    "exp:operand": ({ operand }) => operand_matcher(operand),
    "exp:declaration": ({ declaration }) => declaration_matcher(declaration),
  })(tree)
}

export function operator_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operator:var": ({ name }) => new Exps.Var(pt.str(name)),
    "operator:ap": ({ target, args }) =>
      pt.matchers
        .one_or_more_matcher(args)
        .flatMap((args) => args_matcher(args))
        .reduce(
          (result, arg) => new Exps.Ap(result, arg),
          operator_matcher(target)
        ),
    "operator:fn": ({ names, ret }) =>
      names_matcher(names)
        .reverse()
        .reduce((result, name_entry) => {
          switch (name_entry.kind) {
            case "name": {
              return new Exps.Fn(name_entry.name, result)
            }
            case "implicit": {
              if (!(result instanceof Exps.Fn)) {
                throw new Error(
                  [
                    `When reducing implicit names,`,
                    `the names_matcher expects the result to be Exps.Fn`,
                    `class name: ${result.constructor.name}`,
                  ].join("\n")
                )
              }

              return new Exps.ImFn(
                [
                  ...name_entry.names.map((name) => ({
                    field_name: name,
                    local_name: name,
                  })),
                  {
                    field_name: name_entry.last_name,
                    local_name: name_entry.last_name,
                  },
                ],
                result
              )
            }
          }
        }, exp_matcher(ret)),
    "operator:car": ({ target }) => new Exps.Car(exp_matcher(target)),
    "operator:cdr": ({ target }) => new Exps.Cdr(exp_matcher(target)),
    "operator:dot_field": ({ target, name }) =>
      new Exps.Dot(operator_matcher(target), pt.str(name)),
    "operator:dot_method": ({ target, name, args }) =>
      pt.matchers
        .one_or_more_matcher(args)
        .flatMap((arg) => exps_matcher(arg))
        .reduce(
          (result, exp) => new Exps.Ap(result, exp),
          new Exps.Dot(operator_matcher(target), pt.str(name))
        ),
    "operator:nat_ind": ({ target, motive, base, step }) =>
      new Exps.NatInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:nat_rec": ({ target, base, step }) =>
      new Exps.NatRec(
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:list_ind": ({ target, motive, base, step }) =>
      new Exps.ListInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:list_rec": ({ target, base, step }) =>
      new Exps.ListRec(
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:vector_head": ({ target }) =>
      new Exps.VectorHead(exp_matcher(target)),
    "operator:vector_tail": ({ target }) =>
      new Exps.VectorTail(exp_matcher(target)),
    "operator:vector_ind": ({ length, target, motive, base, step }) =>
      new Exps.VectorInd(
        exp_matcher(length),
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:replace": ({ target, motive, base }) =>
      new Exps.Replace(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base)
      ),
    "operator:absurd_ind": ({ target, motive }) =>
      new Exps.AbsurdInd(exp_matcher(target), exp_matcher(motive)),
    "operator:either_ind": ({ target, motive, base_left, base_right }) =>
      new Exps.EitherInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base_left),
        exp_matcher(base_right)
      ),
    "operator:the": ({ t, exp }) =>
      new Exps.The(exp_matcher(t), exp_matcher(exp)),
    "operator:is": ({ t, exp }) =>
      new Exps.The(exp_matcher(t), exp_matcher(exp)),
  })(tree)
}

export function operand_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operand:pi": pi_handler,
    "operand:sigma": sigma_handler,
    "operand:cons": ({ car, cdr }) =>
      new Exps.Cons(exp_matcher(car), exp_matcher(cdr)),
    "operand:cls": ({ entries }) =>
      pt.matchers
        .zero_or_more_matcher(entries)
        .map(cls_entry_matcher)
        .reverse()
        .reduce(
          (rest_t, entry) =>
            entry.field
              ? new Exps.FulfilledCls(
                  entry.field_name,
                  entry.field_name,
                  entry.field_t,
                  entry.field,
                  rest_t
                )
              : new Exps.ConsCls(
                  entry.field_name,
                  entry.field_name,
                  entry.field_t,
                  rest_t
                ),
          new Exps.NilCls()
        ),
    "operand:ext": ({ parent, entries }) =>
      new Exps.Ext(
        operator_matcher(parent),
        pt.matchers
          .zero_or_more_matcher(entries)
          .map(cls_entry_matcher)
          .reverse()
          .reduce(
            (rest_t, entry) =>
              entry.field
                ? new Exps.FulfilledCls(
                    entry.field_name,
                    entry.field_name,
                    entry.field_t,
                    entry.field,
                    rest_t
                  )
                : new Exps.ConsCls(
                    entry.field_name,
                    entry.field_name,
                    entry.field_t,
                    rest_t
                  ),
            new Exps.NilCls()
          )
      ),
    "operand:obj": ({ properties }) =>
      new Exps.Obj(
        pt.matchers.zero_or_more_matcher(properties).map(property_matcher)
      ),
    "operand:nat": () => new Exps.Nat(),
    "operand:zero": () => new Exps.Zero(),
    "operand:add1": ({ prev }) => new Exps.Add1(exp_matcher(prev)),
    "operand:number": ({ value }, { span }) => {
      const n = Number.parseInt(pt.str(value))
      if (Number.isNaN(n)) {
        throw new pt.ParsingError(
          `Expecting number, instead of: ${JSON.stringify(n)}`,
          { span }
        )
      } else {
        return nat_from_number(n)
      }
    },
    "operand:list": ({ elem_t }) => new Exps.List(exp_matcher(elem_t)),
    "operand:nil": () => new Exps.Nil(),
    "operand:nil_sugar": () => new Exps.Nil(),
    "operand:li": ({ head, tail }) =>
      new Exps.Li(exp_matcher(head), exp_matcher(tail)),
    "operand:li_sugar": ({ exps }) =>
      exps_matcher(exps)
        .reverse()
        .reduce((list, exp) => new Exps.Li(exp, list), new Exps.Nil()),
    "operand:vector": ({ elem_t, length }) =>
      new Exps.Vector(exp_matcher(elem_t), exp_matcher(length)),
    "operand:vecnil": () => new Exps.Vecnil(),
    "operand:vec": ({ head, tail }) =>
      new Exps.Vec(exp_matcher(head), exp_matcher(tail)),
    "operand:vec_sugar": ({ exps }) =>
      exps_matcher(exps)
        .reverse()
        .reduce((vector, exp) => new Exps.Vec(exp, vector), new Exps.Vecnil()),
    "operand:equal": ({ t, from, to }) =>
      new Exps.Equal(exp_matcher(t), exp_matcher(from), exp_matcher(to)),
    "operand:same": () => new Exps.Same(),
    "operand:trivial": () => new Exps.Trivial(),
    "operand:sole": () => new Exps.Sole(),
    "operand:absurd": () => new Exps.Absurd(),
    "operand:str": () => new Exps.Str(),
    "operand:quote": ({ value }) =>
      new Exps.Quote(pt.trim_boundary(pt.str(value), 1)),
    "operand:todo": ({ value }) =>
      new Exps.Todo(pt.trim_boundary(pt.str(value), 1)),
    "operand:either": ({ left_t, right_t }) =>
      new Exps.Either(exp_matcher(left_t), exp_matcher(right_t)),
    "operand:inl": ({ left }) => new Exps.Inl(exp_matcher(left)),
    "operand:inr": ({ right }) => new Exps.Inr(exp_matcher(right)),
    "operand:type": () => new Exps.Type(),
  })(tree)
}

export function declaration_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "declaration:let": ({ name, exp, ret }) =>
      new Exps.Let(pt.str(name), exp_matcher(exp), exp_matcher(ret)),
    "declaration:let_the": ({ name, t, exp, ret }) =>
      new Exps.Let(
        pt.str(name),
        new Exps.The(exp_matcher(t), exp_matcher(exp)),
        exp_matcher(ret)
      ),
    "declaration:let_fn": ({ name, bindings, ret_t, ret, body }) => {
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

      return new Exps.Let(
        pt.str(name),
        new Exps.The(pi_handler({ bindings, ret_t }), fn),
        exp_matcher(body)
      )
    },
  })(tree)
}

export function cls_entry_matcher(tree: pt.Tree): {
  field_name: string
  field_t: Exp
  field?: Exp
} {
  return pt.matcher({
    "cls_entry:field_demanded": ({ name, t }) => ({
      field_name: pt.str(name),
      field_t: exp_matcher(t),
    }),
    "cls_entry:field_fulfilled": ({ name, t, exp }) => ({
      field_name: pt.str(name),
      field_t: exp_matcher(t),
      field: exp_matcher(exp),
    }),
    "cls_entry:method_demanded": ({ name, bindings, ret_t }) => ({
      field_name: pt.str(name),
      field_t: pi_handler({ bindings, ret_t }),
    }),
    "cls_entry:method_fulfilled": ({ name, bindings, ret_t, ret }) => {
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

      return {
        field_name: pt.str(name),
        field_t: pi_handler({ bindings, ret_t }),
        field: fn,
      }
    },
  })(tree)
}

type Binding =
  | { kind: "named"; name: string; exp: Exp }
  | {
      kind: "implicit"
      entries: Array<{ name: string; exp: Exp }>
      last_entry: { name: string; exp: Exp }
    }

export function bindings_matcher(tree: pt.Tree): Array<Binding> {
  return pt.matcher({
    "bindings:bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(binding_matcher),
      binding_matcher(last_entry),
    ],
  })(tree)
}

export function binding_matcher(tree: pt.Tree): Binding {
  return pt.matcher<Binding>({
    "binding:nameless": ({ exp }) => ({
      kind: "named",
      name: "_",
      exp: exp_matcher(exp),
    }),
    "binding:named": ({ name, exp }) => ({
      kind: "named",
      name: pt.str(name),
      exp: exp_matcher(exp),
    }),
    "binding:implicit": ({ entries, last_entry }) => ({
      kind: "implicit",
      entries: pt.matchers
        .zero_or_more_matcher(entries)
        .map(binding_implicit_entry_matcher),
      last_entry: binding_implicit_entry_matcher(last_entry),
    }),
  })(tree)
}

export function binding_implicit_entry_matcher(tree: pt.Tree): {
  name: string
  exp: Exp
} {
  return pt.matcher({
    "binding_implicit_entry:binding_implicit_entry": ({ name, exp }) => ({
      name: pt.str(name),
      exp: exp_matcher(exp),
    }),
  })(tree)
}

export function names_matcher(tree: pt.Tree): Array<NameEntry> {
  return pt.matcher({
    "names:names": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(name_entry_matcher),
      name_entry_matcher(last_entry),
    ],
    "names:names_bracket_separated": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(name_entry_matcher),
      name_entry_matcher(last_entry),
    ],
  })(tree)
}

type NameEntry =
  | { kind: "name"; name: string }
  | { kind: "implicit"; names: Array<string>; last_name: string }

export function name_entry_matcher(tree: pt.Tree): NameEntry {
  return pt.matcher<NameEntry>({
    "name_entry:name_entry": ({ name }) => ({
      kind: "name",
      name: pt.str(name),
    }),
    "name_entry:implicit_name_entry": ({ names, last_name }) => ({
      kind: "implicit",
      names: pt.matchers
        .zero_or_more_matcher(names)
        .map(name_implicit_entry_matcher),
      last_name: name_implicit_entry_matcher(last_name),
    }),
  })(tree)
}

export function name_implicit_entry_matcher(tree: pt.Tree): string {
  return pt.matcher({
    "name_implicit_entry:name_implicit_entry": ({ name }) => pt.str(name),
  })(tree)
}

export function exps_matcher(tree: pt.Tree): Array<Exp> {
  return pt.matcher({
    "exps:exps": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(exp_matcher),
      exp_matcher(last_entry),
    ],
  })(tree)
}

export function args_matcher(tree: pt.Tree): Array<Exp> {
  return pt.matcher({
    "args:args": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(exp_matcher),
      exp_matcher(last_entry),
    ],
  })(tree)
}

export function arg_implicit_entry_matcher(tree: pt.Tree): {
  name: string
  exp: Exp
} {
  return pt.matcher({
    "arg_implicit_entry:arg_implicit_entry": ({ name, exp }) => ({
      name: pt.str(name),
      exp: exp_matcher(exp),
    }),
  })(tree)
}

export function property_matcher(tree: pt.Tree): Exps.Prop {
  return pt.matcher<Exps.Prop>({
    "property:field_shorthand": ({ name }) =>
      new Exps.FieldShorthandProp(pt.str(name)),
    "property:field": ({ name, exp }) =>
      new Exps.FieldProp(pt.str(name), exp_matcher(exp)),
    "property:method": ({ name, bindings, ret_t }) =>
      new Exps.FieldProp(pt.str(name), pi_handler({ bindings, ret_t })),
    "property:spread": ({ exp }) => new Exps.SpreadProp(exp_matcher(exp)),
  })(tree)
}