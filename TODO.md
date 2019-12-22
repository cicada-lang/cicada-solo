- `@show`
- add `function` keyword
# cicada
- equality constrain `equal` in telescope
  - syntax should be `constrain equal x = y`
- define `eqv_t` as class with equality constrains
- [test] define `category_t` as total algebraic structure
- [test] define `category_t` as partial algebraic structure
- `@equal` maybe `@equal_value` `@equal_type`
- handle recursive definition
- [test] some functional programming examples
  - we can not do this without a way to do branching
    like `<exp> choose { case <type> => ... }`
- we also take this opportunity to handle currying
  - just push value to env and return new `ValueFn`
  - also need to change `infer`
# js backend
- a simple compiler to translate the semantics of `eval` to js
# docs
- [semantics] use the concept of **free variable proof** to explain the semantics of cicada
  (traditional type theoretical semantics)
# partech
- clean up partech
- [partech] use exception instead of `Either`
- good error report for earley
  like: https://github.com/kach/nearley/issues/451
- [problem] it would be good to be able to use `rule.ext` to reuse rules
  but this does not handle recursive definitions of rule
  - we may try to reuse hosting language's inheritance
# note
- [maybe] [top] we need a framework for adding new keywords
  - a little bit early to do this now
- [note] we can also use `new` to construct object from class
  - but I choose to use `{}` syntax to construct all objects for now
- [note] no auto currying
- [less important] `Exp` and `Value` use cofree
- [maybe] should we handle `A : type` specially?
  - I think no.
