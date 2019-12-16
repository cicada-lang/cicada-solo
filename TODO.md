# semantics
- use the concept of **free variable proof** to explain the semantics of cicada
  (traditional type theoretical semantics)
# partech
- clean up partech
- good error report for earley
  like: https://github.com/kach/nearley/issues/451
# cicada
- check class's type during top not just infer
- application of class return class instead of object
- use `new` to construct object from class
- factor out `Telescope`
- equality constrain `equal` in telescope
  - syntax should be
    `constrain equal x = y`
  - to define `eqv_t` as class
  - to specify partial algebraic structure
- [note] no auto currying
- [less important] Exp use cofree
