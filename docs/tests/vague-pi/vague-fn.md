# vague fn insertion

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

// check! (
//   vague A,
//   vague B,
//   vague C,
// ) => cons(nil, cons(nil, cons(nil, nil))) : (
//   vague A: Type,
//   vague B: Type,
//   vague C: Type,
//   vague D: Type,
// ) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))

// check! (
//   vague A,
//   vague B,
// ) => cons(nil, cons(nil, cons(nil, nil))) : (
//   vague A: Type,
//   vague B: Type,
//   vague C: Type,
//   vague D: Type,
// ) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))

// check! (
//   vague A,
// ) => cons(nil, cons(nil, cons(nil, nil))) : (
//   vague A: Type,
//   vague B: Type,
//   vague C: Type,
//   vague D: Type,
// ) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))

// check! cons(nil, cons(nil, cons(nil, nil))): (
//   vague A: Type,
//   vague B: Type,
//   vague C: Type,
//   vague D: Type,
// ) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))
```
