- make the syntax more closer to programming language
- [note] inference rules -- specially fulfilling type system
- [note] class and data as both constructor and namespace
- [impl] pie
  ``` pie
  concat(E: U, List(E), List(E)): List(E) =
    List.rec(reverse(E, y), x, step_reverse(E))
  ```
- [learn] how to implement inductive type definition
- `Lattice`
# note
- we need nominal typing
  - because of zero and null and so on
  - we need nominal typing to express our intension
- we can have both fulfilling type system and nominal typing
  - use fulfilling type only for class, keep data simple
- mutual recursive definition at least at top level
# cicada
- [equality] we can implementation equality by built-in equality
  maybe we need to built-in (make it an axiom) the following function
  ``` scala
  transport : {
    equation : Equal(A, x, y)
    motive : { x : A -> Type }
    base : motive(x)
    -> motive(y)
  } = base
  ```
