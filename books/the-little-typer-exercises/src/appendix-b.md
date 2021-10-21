---
title: B. Rules Are Made to Be Spoken
date: 2021-10-12
---

A Type system is a system for guiding human judgment,
In an implementation, each **form of judgment**
corresponds to a function that determines
whether a particular judgment is believable
by the Laws and Commandments.

The forms of judgment for implementations of Pie:

| Form of judgment               | Reading                                          |
|--------------------------------|--------------------------------------------------|
| `is_ctx(ctx)`                  | `ctx` is a context.                              |
| `fresh(ctx) ~> x`              | `ctx` does not bind `x`.                         |
| `lookup(ctx, x) ~> ct`         | looking up `x` in `ctx` yields the type `ct`.    |
| `is_type(ctx, et) ~> ct`       | `et` represents the type `ct`.                   |
| `the_same_type(ctx, c1, c2)`   | `c1` and `c2` are the same type.                 |
| `chech(ctx, e, ct) ~> ce`      | checking `e` can have type `ct` results in `ce`. |
| `infer(ctx, e) ~> the(ct, ce)` | from `e`, infer the `ct` `ce`.                   |
| `the_same(ctx, ct, c1, c2)`    | `c1` is the same `ct` as `c2`.                   |

The use of [Hungarian notation][] in the table above:

| Type   | variable name          |
|--------|------------------------|
| `Ctx`  | `ctx`                  |
| `Var`  | `x`                    |
| `Exp`  | `e`, `et`              |
| `Core` | `c1`, `c2`, `ct`, `ce` |

[Hungarian notation]: https://en.wikipedia.org/wiki/Hungarian_notation
