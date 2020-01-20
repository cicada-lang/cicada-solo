# Impl notes

## About the use of `ValueClInferedFromObj`

If object infer to `ValueCl`,
we will fail to check the
`case succ_t => succ(nat_add(x.prev, y))`
of following function.

``` cicada
function nat_add {
  given x : nat_t
  given y : nat_t
  conclude nat_t
  return switch x {
    case succ_t => succ(nat_add(x.prev, y))
    case zero_t => y
  }
}
```

If we do not use `ValueClInferedFromObj`,
infer object will return `ValueCl` -- class with defined fields,
the value in defined fields might be `Neutral`
(specially when infering the type of `Switch`),

When infer `Fn` we need a readback to get the `return_type` of `ValuePi`,
but if we readback neutral, and evaluate a neutral value
in the env extended during inferring `Ap`,
for example, `nat_add(zero, zero)`, env will be extended by `x = zero`,
but when evaluate `x.prev`, there is no field `prev` in `zero`.

Thus, object should infer to `ValueClInferedFromObj` instead of `ValueCl`,
which means infer need to strip off the object level information of object.

If we do so,
we will not be able to simply implement `check` by `infer` and `subtype`,
but I think this is necessary.
