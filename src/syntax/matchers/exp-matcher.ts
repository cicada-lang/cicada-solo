import pt from "@cicada-lang/partech"
import { Exp } from "../../exp"
import { nat_from_number } from "../../semantics/nat/nat-util"
import * as Sem from "../../sem"
import * as ut from "../../ut"

export function pi_handler(body: { [key: string]: pt.Tree }): Exp {
  const { bindings, ret_t } = body

  return bindings_matcher(bindings)
    .reverse()
    .flatMap(({ names, exp }) => names.map((name) => ({ name, exp })).reverse())
    .reduce(
      (result, { name, exp }) => new Sem.Pi(name, exp, result),
      exp_matcher(ret_t)
    )
}

export function sigma_handler(body: { [key: string]: pt.Tree }): Exp {
  const { bindings, cdr_t } = body

  return bindings_matcher(bindings)
    .reverse()
    .flatMap(({ names, exp }) => names.map((name) => ({ name, exp })).reverse())
    .reduce(
      (result, { name, exp }) => new Sem.Sigma(name, exp, result),
      exp_matcher(cdr_t)
    )
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
    "operator:var": ({ name }) => new Sem.Var(pt.str(name)),
    "operator:ap": ({ target, args }) =>
      pt.matchers
        .one_or_more_matcher(args)
        .flatMap((arg) => exps_matcher(arg))
        .reduce(
          (result, exp) => new Sem.Ap(result, exp),
          operator_matcher(target)
        ),
    "operator:fn": ({ names, ret }) =>
      names_matcher(names)
        .reverse()
        .reduce((result, name) => new Sem.Fn(name, result), exp_matcher(ret)),
    "operator:car": ({ target }) => new Sem.Car(exp_matcher(target)),
    "operator:cdr": ({ target }) => new Sem.Cdr(exp_matcher(target)),
    "operator:dot_field": ({ target, name }) =>
      new Sem.Dot(operator_matcher(target), pt.str(name)),
    "operator:dot_method": ({ target, name, args }) =>
      pt.matchers
        .one_or_more_matcher(args)
        .flatMap((arg) => exps_matcher(arg))
        .reduce(
          (result, exp) => new Sem.Ap(result, exp),
          new Sem.Dot(operator_matcher(target), pt.str(name))
        ),
    "operator:nat_ind": ({ target, motive, base, step }) =>
      new Sem.NatInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:nat_rec": ({ target, base, step }) =>
      new Sem.NatRec(
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:list_ind": ({ target, motive, base, step }) =>
      new Sem.ListInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:list_rec": ({ target, base, step }) =>
      new Sem.ListRec(
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:vector_head": ({ target }) =>
      new Sem.VectorHead(exp_matcher(target)),
    "operator:vector_tail": ({ target }) =>
      new Sem.VectorTail(exp_matcher(target)),
    "operator:vector_ind": ({ length, target, motive, base, step }) =>
      new Sem.VectorInd(
        exp_matcher(length),
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:replace": ({ target, motive, base }) =>
      new Sem.Replace(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base)
      ),
    "operator:absurd_ind": ({ target, motive }) =>
      new Sem.AbsurdInd(exp_matcher(target), exp_matcher(motive)),
    "operator:either_ind": ({ target, motive, base_left, base_right }) =>
      new Sem.EitherInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base_left),
        exp_matcher(base_right)
      ),
    "operator:the": ({ t, exp }) =>
      new Sem.The(exp_matcher(t), exp_matcher(exp)),
    "operator:is": ({ t, exp }) =>
      new Sem.The(exp_matcher(t), exp_matcher(exp)),
  })(tree)
}

export function operand_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operand:pi": pi_handler,
    "operand:sigma": sigma_handler,
    "operand:cons": ({ car, cdr }) =>
      new Sem.Cons(exp_matcher(car), exp_matcher(cdr)),
    "operand:cls": ({ entries }) =>
      pt.matchers
        .zero_or_more_matcher(entries)
        .map(cls_entry_matcher)
        .reverse()
        .reduce(
          (rest_t, entry) =>
            new Sem.ClsCons(
              entry.field_name,
              entry.field_name,
              entry.field_t,
              rest_t
            ),
          new Sem.ClsNil()
        ),
    "operand:ext": ({ parent, entries }) =>
      new Sem.Ext(
        operator_matcher(parent),
        pt.matchers
          .zero_or_more_matcher(entries)
          .map(cls_entry_matcher)
          .reverse()
          .reduce(
            (rest_t, entry) =>
              new Sem.ClsCons(
                entry.field_name,
                entry.field_name,
                entry.field_t,
                rest_t
              ),
            new Sem.ClsNil()
          )
      ),
    "operand:obj": ({ properties }) =>
      new Sem.Obj(
        pt.matchers.zero_or_more_matcher(properties).map(property_matcher)
      ),
    "operand:nat": () => new Sem.Nat(),
    "operand:zero": () => new Sem.Zero(),
    "operand:add1": ({ prev }) => new Sem.Add1(exp_matcher(prev)),
    "operand:number": ({ value }, { span }) => {
      const n = Number.parseInt(pt.str(value))
      if (Number.isNaN(n)) {
        throw new pt.ParsingError(
          `Expecting number, instead of: ${ut.inspect(n)}`,
          { span }
        )
      } else {
        return nat_from_number(n)
      }
    },
    "operand:list": ({ elem_t }) => new Sem.List(exp_matcher(elem_t)),
    "operand:nil": () => new Sem.Nil(),
    "operand:nil_sugar": () => new Sem.Nil(),
    "operand:li": ({ head, tail }) =>
      new Sem.Li(exp_matcher(head), exp_matcher(tail)),
    "operand:li_sugar": ({ exps }) =>
      exps_matcher(exps)
        .reverse()
        .reduce((list, exp) => new Sem.Li(exp, list), new Sem.Nil()),
    "operand:vector": ({ elem_t, length }) =>
      new Sem.Vector(exp_matcher(elem_t), exp_matcher(length)),
    "operand:vecnil": () => new Sem.Vecnil(),
    "operand:vec": ({ head, tail }) =>
      new Sem.Vec(exp_matcher(head), exp_matcher(tail)),
    "operand:vec_sugar": ({ exps }) =>
      exps_matcher(exps)
        .reverse()
        .reduce((vector, exp) => new Sem.Vec(exp, vector), new Sem.Vecnil()),
    "operand:equal": ({ t, from, to }) =>
      new Sem.Equal(exp_matcher(t), exp_matcher(from), exp_matcher(to)),
    "operand:same": () => new Sem.Same(),
    "operand:trivial": () => new Sem.Trivial(),
    "operand:sole": () => new Sem.Sole(),
    "operand:absurd": () => new Sem.Absurd(),
    "operand:str": () => new Sem.Str(),
    "operand:quote": ({ value }) =>
      new Sem.Quote(pt.trim_boundary(pt.str(value), 1)),
    "operand:either": ({ left_t, right_t }) =>
      new Sem.Either(exp_matcher(left_t), exp_matcher(right_t)),
    "operand:inl": ({ left }) => new Sem.Inl(exp_matcher(left)),
    "operand:inr": ({ right }) => new Sem.Inr(exp_matcher(right)),
    "operand:type": () => new Sem.Type(),
  })(tree)
}

export function declaration_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "declaration:let": ({ name, exp, ret }) =>
      new Sem.Let(pt.str(name), exp_matcher(exp), exp_matcher(ret)),
    "declaration:let_the": ({ name, t, exp, ret }) =>
      new Sem.Let(
        pt.str(name),
        new Sem.The(exp_matcher(t), exp_matcher(exp)),
        exp_matcher(ret)
      ),
    "declaration:let_fn": ({ name, bindings, ret_t, ret, body }) => {
      const fn = bindings_matcher(bindings)
        .reverse()
        .flatMap(({ names }) => names.reverse())
        .reduce((fn, name) => new Sem.Fn(name, fn), exp_matcher(ret))

      return new Sem.Let(
        pt.str(name),
        new Sem.The(pi_handler({ bindings, ret_t }), fn),
        exp_matcher(body)
      )
    },
  })(tree)
}

export function cls_entry_matcher(tree: pt.Tree): {
  field_name: string
  field_t: Exp
  field_exp?: Exp
} {
  return pt.matcher({
    "cls_entry:field_demanded": ({ name, t }) => ({
      field_name: pt.str(name),
      field_t: exp_matcher(t),
    }),
    "cls_entry:field_fulfilled": ({ name, t, exp }) => ({
      field_name: pt.str(name),
      field_t: exp_matcher(t),
      field_exp: exp_matcher(exp),
    }),
    "cls_entry:method_demanded": ({ name, bindings, ret_t }) => ({
      field_name: pt.str(name),
      field_t: pi_handler({ bindings, ret_t }),
    }),
    "cls_entry:method_fulfilled": ({ name, bindings, ret_t, ret }) => {
      const fn = bindings_matcher(bindings)
        .reverse()
        .flatMap(({ names }) => names.reverse())
        .reduce((fn, name) => new Sem.Fn(name, fn), exp_matcher(ret))

      return {
        field_name: pt.str(name),
        field_t: pi_handler({ bindings, ret_t }),
        field_exp: fn,
      }
    },
  })(tree)
}

export function bindings_matcher(
  tree: pt.Tree
): Array<{ names: Array<string>; exp: Exp }> {
  return pt.matcher({
    "bindings:bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(binding_entry_matcher),
      binding_entry_matcher(last_entry),
    ],
  })(tree)
}

export function binding_entry_matcher(tree: pt.Tree): {
  names: Array<string>
  exp: Exp
} {
  return pt.matcher({
    "binding_entry:nameless": ({ exp }) => ({
      names: ["_"],
      exp: exp_matcher(exp),
    }),
    "binding_entry:named": ({ name, exp }) => ({
      names: [pt.str(name)],
      exp: exp_matcher(exp),
    }),
    "binding_entry:multi_named": ({ names, exp }) => ({
      names: pt.matchers.one_or_more_matcher(names).map(pt.str),
      exp: exp_matcher(exp),
    }),
  })(tree)
}

export function names_matcher(tree: pt.Tree): Array<string> {
  return pt.matcher({
    "names:names": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(pt.str),
      pt.str(last_entry),
    ],
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

export function property_matcher(tree: pt.Tree): Sem.Prop {
  return pt.matcher<Sem.Prop>({
    "property:field_shorthand": ({ name }) =>
      new Sem.FieldShorthandProp(pt.str(name)),
    "property:field": ({ name, exp }) =>
      new Sem.FieldProp(pt.str(name), exp_matcher(exp)),
    "property:method": ({ name, bindings, ret_t }) =>
      new Sem.FieldProp(pt.str(name), pi_handler({ bindings, ret_t })),
    "property:spread": ({ exp }) => new Sem.SpreadProp(exp_matcher(exp)),
  })(tree)
}
