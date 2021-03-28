# Explicit record passing vs implicit type argument

2020-10-31

We might attempt to implement implicit type argument
by the following changes to lang3:

- [lang3] checking about `Pattern` in the `arg_t` and `ret_t` of `pi`
  - we also need to use unification here.
  - we will need a new ctx-like argument for equations -- `Equ`.

- [lang3] maybe merge `env` `ctx` `equ` into `the`.

But we should play with explicit record passing first,
just to see what will happen if we do so.

## 两种实现方式

实现 implicit type argument 有两种方式，
一种主动标记 "given argument of type"，
另一种是从 "infer given type from pattern variables"。

我们可以先尝试第一种，然后再实现第二种。
因为，第一种也许比第二种简单（也许一样简单），
而且我们的最终语言，是同时需要两种方式的（所以不能避免第一种）。
