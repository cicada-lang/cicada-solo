# vague-fn insertion -- on implicit-fn

``` cicada
check! (
  vague A,
  vague B,
  vague C,
  implicit T,
  x,
) => cons(nil, cons(nil, cons(nil, T))): (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  implicit T: Type,
  x: T,
) -> Pair(List(A), Pair(List(B), Pair(List(C), Type)))

check! (
  vague A,
  vague B,
  implicit T,
  x,
) => cons(nil, cons(nil, cons(nil, T))): (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  implicit T: Type,
  x: T,
) -> Pair(List(A), Pair(List(B), Pair(List(C), Type)))

check! (
  vague A,
  implicit T,
  x,
) => cons(nil, cons(nil, cons(nil, T))): (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  implicit T: Type,
  x: T,
) -> Pair(List(A), Pair(List(B), Pair(List(C), Type)))

check! (
  implicit T,
  x,
) => cons(nil, cons(nil, cons(nil, T))): (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  implicit T: Type,
  x: T,
) -> Pair(List(A), Pair(List(B), Pair(List(C), Type)))
```

# vague-fn insertion -- on sigma

``` cicada
check! (
  vague A,
  vague B,
  vague C,
  vague D,
) => cons(nil, cons(nil, cons(nil, nil))) : (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  vague D: Type,
) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))

check! (
  vague A,
  vague B,
  vague C,
) => cons(nil, cons(nil, cons(nil, nil))) : (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  vague D: Type,
) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))

check! (
  vague A,
  vague B,
) => cons(nil, cons(nil, cons(nil, nil))) : (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  vague D: Type,
) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))

check! (
  vague A,
) => cons(nil, cons(nil, cons(nil, nil))) : (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  vague D: Type,
) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))

check! cons(nil, cons(nil, cons(nil, nil))): (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  vague D: Type,
) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))
```
