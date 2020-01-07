# unified-env
- [unified-env] `readback`
- [unified-env] `subtype`
- [unified-env] `equivalent`
- [unified-env] api
- [unified-env] test
# Problem
- Problem: fail to check
  ``` cicada
  vector_append : {
    A : type
    m : nat_t
    n : nat_t
    x : vector_t(A, m)
    y : vector_t(A, n)
    -> vector_t(A, nat_add(m, n))
  }
  ```
  fail to form NeutralSwitch
- Solution:
  - use case-lambda instead of switch
  - use unified-env
# cicada
- [example] vector_append
- [equality] we can implementation equality by built-in equality
  maybe we need to built-in (make it an axiom) the following function
  ``` cicada
  transport : {
    A : type
    x : A
    y : A
    equation : equation_t(A, x, y)
    motive : { x : A -> type }
    value : motive(x)
    -> motive(y)
  } = {
    A : type
    x : A
    y : A
    equation : equation_t(A, x, y)
    motive : { x : A -> type }
    value : motive(x)
    => value
  }
  ```
- [test] define `category_t` as algebraic structure
- [test] define  `contextual_pre_category_t` as algebraic structure
- mutual recursive definition only at top level
- [module system] not so hurry, after the core is stable
# learn from gradual type system
- how they refine type in a `if` block?
# js backend
- a simple compiler to translate the semantics of `eval` to js
# partech
- notes about tree collection
- fix span in collected tree?
- fix the use of `Error("TODO")`
- handle top list by simple parser first
# note
- [maybe] [top] we need a framework for adding new keywords
  - a little bit early to do this now
- [note] we can also use `new` to construct object from class
  - but I choose to use `{}` syntax to construct all objects for now
- [maybe] `Exp`
- [maybe] should we handle `A : type` specially?
  - I think no.
