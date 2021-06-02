import pt from "@cicada-lang/partech"
import { Exp } from "../../exp"
import { nat_from_number } from "../../exps/nat/nat-util"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export function pi_handler(body: { [key: string]: pt.Tree }): Exp {
  const { bindings, ret_t } = body

  return bindings_matcher(bindings)
    .reverse()
    .flatMap(({ names, exp }) => names.map((name) => ({ name, exp })).reverse())
    .reduce(
      (result, { name, exp }) => new Exps.Pi(name, exp, result),
      exp_matcher(ret_t)
    )
}

export function sigma_handler(body: { [key: string]: pt.Tree }): Exp {
  const { bindings, cdr_t } = body

  return bindings_matcher(bindings)
    .reverse()
    .flatMap(({ names, exp }) => names.map((name) => ({ name, exp })).reverse())
    .reduce(
      (result, { name, exp }) => new Exps.Sigma(name, exp, result),
      exp_matcher(cdr_t)
    )
}

export function exp_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "exp:elim": ({ elim }) => elim_matcher(elim),
    "exp:cons": ({ cons }) => cons_matcher(cons),
  })(tree)
}

export function elim_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "elim:var": ({ name }) => new Exps.Var(pt.str(name)),
    "elim:ap": ({ target, args }) =>
      pt.matchers
        .one_or_more_matcher(args)
        .flatMap((arg) => exps_matcher(arg))
        .reduce(
          (result, exp) => new Exps.Ap(result, exp),
          new Exps.Var(pt.str(target))
        ),
    "elim:car": ({ target }) => new Exps.Car(exp_matcher(target)),
    "elim:cdr": ({ target }) => new Exps.Cdr(exp_matcher(target)),
    "elim:dot_field": ({ target, name }) =>
      new Exps.Dot(elim_matcher(target), pt.str(name)),
    "elim:dot_method": ({ target, name, args }) =>
      pt.matchers
        .one_or_more_matcher(args)
        .flatMap((arg) => exps_matcher(arg))
        .reduce(
          (result, exp) => new Exps.Ap(result, exp),
          new Exps.Dot(elim_matcher(target), pt.str(name))
        ),
    "elim:nat_ind": ({ target, motive, base, step }) =>
      new Exps.NatInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "elim:nat_rec": ({ target, base, step }) =>
      new Exps.NatRec(
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "elim:list_ind": ({ target, motive, base, step }) =>
      new Exps.ListInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "elim:list_rec": ({ target, base, step }) =>
      new Exps.ListRec(
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "elim:vector_head": ({ target }) =>
      new Exps.VectorHead(exp_matcher(target)),
    "elim:vector_tail": ({ target }) =>
      new Exps.VectorTail(exp_matcher(target)),
    "elim:vector_ind": ({ length, target, motive, base, step }) =>
      new Exps.VectorInd(
        exp_matcher(length),
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "elim:replace": ({ target, motive, base }) =>
      new Exps.Replace(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base)
      ),
    "elim:absurd_ind": ({ target, motive }) =>
      new Exps.AbsurdInd(exp_matcher(target), exp_matcher(motive)),
  })(tree)
}

export function cons_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "cons:pi": pi_handler,
    "cons:fn": ({ names, ret }) =>
      names_matcher(names)
        .reverse()
        .reduce((result, name) => new Exps.Fn(name, result), exp_matcher(ret)),
    "cons:sigma": sigma_handler,
    "cons:cons": ({ car, cdr }) =>
      new Exps.Cons(exp_matcher(car), exp_matcher(cdr)),
    "cons:cons_sugar": ({ exps, cdr }) =>
      exps_matcher(exps)
        .reverse()
        .reduce((result, exp) => new Exps.Cons(exp, result), exp_matcher(cdr)),
    "cons:cls": ({ entries }) =>
      new Exps.Cls(
        pt.matchers.zero_or_more_matcher(entries).map(cls_entry_matcher)
      ),
    "cons:ext": ({ parent_name, entries }) =>
      new Exps.Ext(
        pt.str(parent_name),
        pt.matchers.zero_or_more_matcher(entries).map(cls_entry_matcher)
      ),
    "cons:obj": ({ properties }) =>
      new Exps.Obj(
        pt.matchers.zero_or_more_matcher(properties).map(property_matcher)
      ),
    "cons:nat": () => new Exps.Nat(),
    "cons:zero": () => new Exps.Zero(),
    "cons:add1": ({ prev }) => new Exps.Add1(exp_matcher(prev)),
    "cons:number": ({ value }, { span }) => {
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
    "cons:list": ({ elem_t }) => new Exps.List(exp_matcher(elem_t)),
    "cons:nil": () => new Exps.Nil(),
    "cons:nil_sugar": () => new Exps.Nil(),
    "cons:li": ({ head, tail }) =>
      new Exps.Li(exp_matcher(head), exp_matcher(tail)),
    "cons:li_sugar": ({ exps }) =>
      exps_matcher(exps)
        .reverse()
        .reduce((list, exp) => new Exps.Li(exp, list), new Exps.Nil()),
    "cons:vector": ({ elem_t, length }) =>
      new Exps.Vector(exp_matcher(elem_t), exp_matcher(length)),
    "cons:vecnil": () => new Exps.Vecnil(),
    "cons:vec": ({ head, tail }) =>
      new Exps.Vec(exp_matcher(head), exp_matcher(tail)),
    "cons:vec_sugar": ({ exps }) =>
      exps_matcher(exps)
        .reverse()
        .reduce((vector, exp) => new Exps.Vec(exp, vector), new Exps.Vecnil()),
    "cons:equal": ({ t, from, to }) =>
      new Exps.Equal(exp_matcher(t), exp_matcher(from), exp_matcher(to)),
    "cons:same": () => new Exps.Same(),
    "cons:trivial": () => new Exps.Trivial(),
    "cons:sole": () => new Exps.Sole(),
    "cons:absurd": () => new Exps.Absurd(),
    "cons:str": () => new Exps.Str(),
    "cons:quote": ({ value }) =>
      new Exps.Quote(pt.trim_boundary(pt.str(value), 1)),
    "cons:type": () => new Exps.Type(),
    "cons:let": ({ name, exp, ret }) =>
      new Exps.Let(pt.str(name), exp_matcher(exp), exp_matcher(ret)),
    "cons:let_the": ({ name, t, exp, ret }) =>
      new Exps.Let(
        pt.str(name),
        new Exps.The(exp_matcher(t), exp_matcher(exp)),
        exp_matcher(ret)
      ),
    "cons:let_fn": ({ name, bindings, ret_t, ret, body }) => {
      const fn = bindings_matcher(bindings)
        .reverse()
        .flatMap(({ names }) => names.reverse())
        .reduce((fn, name) => new Exps.Fn(name, fn), exp_matcher(ret))

      return new Exps.Let(
        pt.str(name),
        new Exps.The(pi_handler({ bindings, ret_t }), fn),
        exp_matcher(body)
      )
    },
    "cons:the": ({ t, exp }) => new Exps.The(exp_matcher(t), exp_matcher(exp)),
  })(tree)
}

export function cls_entry_matcher(tree: pt.Tree): {
  name: string
  t: Exp
  exp?: Exp
} {
  return pt.matcher({
    "cls_entry:field_demanded": ({ name, t }) => ({
      name: pt.str(name),
      t: exp_matcher(t),
    }),
    "cls_entry:field_fulfilled": ({ name, t, exp }) => ({
      name: pt.str(name),
      t: exp_matcher(t),
      exp: exp_matcher(exp),
    }),
    "cls_entry:method_demanded": ({ name, bindings, ret_t }) => ({
      name: pt.str(name),
      t: pi_handler({ bindings, ret_t }),
    }),
    "cls_entry:method_fulfilled": ({ name, bindings, ret_t, ret }) => {
      const fn = bindings_matcher(bindings)
        .reverse()
        .flatMap(({ names }) => names.reverse())
        .reduce((fn, name) => new Exps.Fn(name, fn), exp_matcher(ret))

      return {
        name: pt.str(name),
        t: pi_handler({ bindings, ret_t }),
        exp: fn,
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
