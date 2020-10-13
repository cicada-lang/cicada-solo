# Readback Recursive Expression

2020-10-13

## [lang3] [problem]

> We can not `readback` recursive exp.

- [thought] learn from "A simple type-theoretic language: Mini-TT".
  - minitt do not handle this well.
    in minitt, recursive exp occurs in sum.
    but normalization of sum is implemented by readback env,
    which is what the authors meant by,
    "our way of comparing functions defined by case is less refined than the one in [10].
    Though less refined, we think that our approach is simpler to implement at a machine level."
    where [10] is "A compiled implementation of strong reduction."
    by Benjamin Grégoire and Xavier Leroy.

- [thought] learn from "A compiled implementation of strong reduction."
  - the authors use "guarded fixpoints" to handle recursion.
    the authors can handle the problem because they have general knowledge about recursion.
    we plan to learn the same from Raymond Smullyan.

- [thought] how to define normal form of recursive exp?
  - this is about normalizing graph instead of tree.
  - maybe we can use special linearization to linearize graph to tree?
  - maybe on the first time a global name occur, we eval it,
    and on the second time the same name occur, we view it as variable.
    - this might be not better than minitt's approach.
    - we need to construct counterexample of this.
    - name is part of this equivalent relation.
      - for example `List` and `Lizt` will be not equivalent.
        but if we generate variable name from type,
        they will be viewed as equivalent.

- [thought] learn from "Diagonalization and Self-Reference" by Raymond Smullyan

## [lang3] [maybe]

- [maybe] `opts.shadow_mod_value_p` in:
  - Closure.apply
  - Telescope.fill
  - and so on ...
