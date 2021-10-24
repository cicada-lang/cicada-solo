---
title: B. Rules Are Made to Be Spoken
date: 2021-10-12
---

# Forms of judgment

A Type system is a system for guiding human judgment,
In an implementation, each *form of judgment*
corresponds to a function that determines
whether a particular judgment is believable
by the Laws and Commandments.

# Implementation patterns

## Bidirectional type checking

To translate inference rules to type checking functions,
we do not just implement `check` or `infer`, but both.

```
check(ctx: Ctx, e: Exp, t: Type)
infer(ctx: Ctx, e: Exp): Type
```

## Elaboratation

During the process of type checking, we can get a lot of information as by-product,
we should not waste them, we should use a extra data type to capture them.

We not only using the data type `Exp`, but also use a data type `Core`.

```
// Not:
check(ctx: Ctx, e: Exp, t: Type)
infer(ctx: Ctx, e: Exp): Type

// But:
check(ctx: Ctx, e: Exp, t: Type): Core
infer(ctx: Ctx, e: Exp): { t: Type, core: Core }
```

# The forms of judgment for implementations of Pie

The use of [Hungarian notation][] in the table below:

| Type   | Variable name          |
|--------|------------------------|
| `Ctx`  | `ctx`                  |
| `Var`  | `x`                    |
| `Exp`  | `e`, `et`              |
| `Core` | `c1`, `c2`, `ct`, `ce` |

[Hungarian notation]: https://en.wikipedia.org/wiki/Hungarian_notation

The forms of judgment for implementations of Pie:

| Form of judgment               | Reading                                          |
|--------------------------------|--------------------------------------------------|
| `is_ctx(ctx)`                  | `ctx` is a context.                              |
| `fresh(ctx) ~> x`              | `ctx` does not bind `x`.                         |
| `lookup(ctx, x) ~> ct`         | looking up `x` in `ctx` yields the type `ct`.    |
| `is_type(ctx, et) ~> ct`       | `et` represents the type `ct`.                   |
| `the_same_type(ctx, c1, c2)`   | `c1` and `c2` are the same type.                 |
| `check(ctx, e, ct) ~> ce`      | checking `e` can have type `ct` results in `ce`. |
| `infer(ctx, e) ~> the(ct, ce)` | from `e`, infer the `ct` `ce`.                   |
| `the_same(ctx, ct, c1, c2)`    | `c1` is the same `ct` as `c2`.                   |

# Inference rules

Forms of judgment occur within *inference rules*.
An inference rule consists of a horizontal line.
Below the line is a *conclusion*, and above the line
is any number of *premises*.

The meaning of a inference rule is that,
if one believes in the premises,
then one should also believe in the conclusion.

Because the same conclusion can occur in multiple rules,
belief in the premises cannot be derived from belief in the conclusion.

Each rule has a name, written in `[...]` to the right of the rule.

## The interactions between checking and inferring

In the following examples, we use `^o` as postfix superscript,
to denote elaboratation result of the corresponding variable.

Changing from inferring to checking (implement `infer` by `check`),
requires an annotation to check against.

```
is_type(ctx, X) ~> X^o
check(ctx, X^o, exp) ~> exp^o
-------------------------------------------- [the]
infer(ctx, the(X, exp)) ~> the(X^o, exp^o)
```

In bidirectional type checking,
we can read the above inference rule as a function
implementing `infer` in the case of the `the` expression.

Note that:
- The input of the conclusion is read as arguments of the function.
- The output of the conclusion is read as return value of the function.
- The input of a promise is read as arguments of recursive call to form of judgments.
- The output of a promise is read as return value of recursive call to form of judgments.

```
infer(ctx, the(X, exp)) {
  X^o = is_type(ctx, X)
  exp^o = check(ctx, X^o, exp)
  the(X^o, exp^o)
}
```

Changing from checking to inferring (implement `check` by `infer`),
requires an equality comparison.

```
infer(ctx, exp) ~> the(X1, exp^o)
the_same_type(ctx, X1, X2)
------------------------------------ [switch]
check(ctx, exp, X2) ~> exp^o
```

Read as a function implementing `check` by `infer`
when `infer` is implemented for `exp`.

```
check(ctx, exp, X2) {
  the(X1, exp^o) = infer(ctx, exp)
  the_same_type(ctx, X1, X2)
  exp^o
}
```

- Xie: Knowing how to read bidirectional type inference rules as functions,
  it almost does not make sense to keep using the traditional syntax of inference rules,
  but people in the community are so familiar with it.

A the-expression is the same as its second argument.

```
the_same(ctx, X, exp1, exp2)
------------------------------------ [the_same]
the_same(ctx, X, the(X, exp1), exp2)
```

Read as a function implementing in the case of the `the` expression.

```
the_same(ctx, X, the(X, exp1), exp2) {
  the_same(ctx, X, exp1, exp2)
}
```

## Categories of inference rules

Aside from [the], [switch], and one of the rules for `Type`,
the rules fall into one of a few categories:

1. *formation rules*, which describe the conditions under which an expression is a type;
2. *introduction rules*, which describe the constructors for a type;
3. *elimination rules*, which describe the eliminators for a type;
4. *computation rules*, which describe the behavior of eliminators whose targets are constructors;
5. *eta-rules*, which describe how to turn neutral expressions into values for some types;
6. *other sameness rules*, which describe when sameness of subexpressions implies sameness.

## Sameness

It is important to remember that
rules whose conclusions are sameness judgments
are *specifications* for a normalization algorithm,
rather than a description of the algorithm itself.

```
the_same(ctx, X, exp2, exp1)
---------------------------- [same_symmetric]
the_same(ctx, X, exp1, exp2)
```

```
the_same(ctx, X, exp1, exp2)
the_same(ctx, X, exp2, exp3)
---------------------------- [same_transitive]
the_same(ctx, X, exp1, exp3)
```

## Variables

```
lookup(ctx, x) ~> X
---------------------------- [hypothesis]
infer(ctx, x) ~> the(X, x)
```

> To infer a type for a variable `x`,
> look it up in the context `ctx`.
> If the lookup succeeds with type `X`,
> infer succeeds with the `Core` expression `the(X, x)`.

```
lookup(ctx, x) ~> X
------------------------ [hypothesis_same]
the_same(ctx, X, x, x)
```

> If a variable `x` is given type `X` by the context `ctx`,
> then conversion checking must find that `x` is the same `X` as `x`.

## String

```
-------------------------------- [string formation]
is_type(ctx, String) ~> String
```

```
------------------------------------ [string same type]
the_same_type(ctx, String, String)
```

```
------------------------------------ [string intro]
infer(ctx, str) ~> the(String, str)
```

> Given a doublequoted literal value `str`,
> I inter its type to be `String`,
> and its core to be the literal value `str` itself.

```
------------------------------------ [string same quote]
the_same(ctx, String, str, str)
```
