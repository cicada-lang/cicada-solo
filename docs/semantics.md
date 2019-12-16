# Semantics

## Traditional type theory semantics

To assert the judgement `A : type`,
we must know how to check whether an element `x` is of the type `A`.
or say, we can implement the function `check` for this type `A`.

To assert the judgement `x : A`,
we must have a successful checking that `x` is of the type `A`.
or say, the function `check` applied to `x` and `A`
returns a value what means the checking is successful.

## Algebraic semantics
