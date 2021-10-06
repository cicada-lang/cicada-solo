---
title: Traditional semantics vs Algebraic semantics
---

# Traditional type theory semantics

This kind of semantics is description of implementation.
Just like pseudocode of algorithm,
the description do not use specific programming language.
And the description always ignore error report in a real implementation.

To assert the judgement `A : type`,
we must know how to check whether an element `x` is of the type `A`.
or say, we can implement the function `check` for this type `A`.

To assert the judgement `x : A`,
we must have a successful checking that `x` is of the type `A`.
or say, apply the function `check` to `x` and `A` will be success.

# Algebraic semantics

This kind of semantics is to specify
how the implementation can be viewed as
an instance of an abstract class (a mathematical structure).

First we need to know what is the appropriate mathematical structure.
