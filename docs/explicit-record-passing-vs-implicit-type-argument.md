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
