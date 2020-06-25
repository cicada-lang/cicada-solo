# a prolog-like DSL for bidirectional type checking

where uppercase letters are data constructors
and lowercase letters at argument position are meta variables
and lowercase letters at function position are relation
for example: `UpperCase(lower_case)`

ctx |- e <= t
---------------------
ctx |- The(t, e) => t

ctx |- e <= t2
t1 == t2
---------------------
ctx |- e <= t1

a = lookup(x, ctx)
---------------------
ctx |- x => a

ctx, x: a |- e <= b
---------------------
ctx |- Fn(x, e) <= Arrow(a, b)

ctx |- f => Arrow(a, b)
ctx |- e <= a
---------------------
ctx |- Ap(f, e) => b

a prolog-like DSL for bidirectional type checking,
would be wrong.

because the aim of split one judgment `:`
to two judgments `=>` and `<=`
is to avoid searching
and making the group of inference rules deterministic.
