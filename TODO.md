# semantics
- use the concept of **free variable proof** to explain the semantics of cicada
  (traditional type theoretical semantics)
# partech
- clean up partech
- [partech] use exception instead of `Either`
- good error report for earley
  like: https://github.com/kach/nearley/issues/451
# cicada
- `subtype` for `ValueCl`
- `equivalent` for `ValueCl`
- we also take this opportunity to handle currying
  just push value to env and return new `ValueFn`
- equality constrain `equal` in telescope
  syntax should be
  `constrain equal x = y`
- define `eqv_t` as class with equality constrains
- [test] define `category_t` as total algebraic structure
- [test] define `category_t` as partial algebraic structure
- [note] we can also use `new` to construct object from class
  but I choose to use `{}` syntax to construct all objects for now
- [note] no auto currying
- [less important] Exp use cofree
- [maybe] should we handle `A : type` specially?
  - I think no.
