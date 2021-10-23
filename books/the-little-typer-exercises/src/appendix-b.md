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

# The interactions between checking and inferring

In the following examples, we use `^o` as postfix superscript,
to denote elaboratation result of the corresponding variable.

Changing from inferring to checking (implement `infer` by `check`),
requires an annotation to check against.

```
is_type(ctx, X) ~> X^o
check(ctx, X^o, exp) ~> exp^o
---------------------------------------- [the]
infer(ctx, the(X, exp)) ~> the(X^o, exp^o)
```

In bidirectional type checking,
we can read the above inference rule as a function
implementing `infer` in the case of the `the` expression.

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
