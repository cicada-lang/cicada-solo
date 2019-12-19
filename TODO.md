# semantics
- use the concept of **free variable proof** to explain the semantics of cicada
  (traditional type theoretical semantics)
# partech
- clean up partech
- [partech] use exception instead of `Either`
- good error report for earley
  like: https://github.com/kach/nearley/issues/451
# cicada
- factor out `Telescope`
- also factor out `Telescope` with return (return type or return value)
- we also take this opportunity to handle currying
  be careful about equality
- application of class return type instead of object
- equality constrain `equal` in telescope
  - syntax should be
    `constrain equal x = y`
  - to define `eqv_t` as class
  - to specify partial algebraic structure
- [note] we can also use `new` to construct object from class
  but I choose to use `{}` syntax to construct all objects for now
- [note] no auto currying
- [less important] Exp use cofree
- [maybe] should we handle `A : type` specially?
  - I think no.
