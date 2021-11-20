---
title: Hurkens Paradox
author: Zaoqi
---

Learned from [a agda test](https://github.com/agda/agda/blob/master/test/Succeed/Hurkens.agda).

``` cicada
Bottom: Type = (A: Type) -> A

Not(A: Type): Type {
  return (A) -> Bottom
}

P(A: Type): Type {
  return (A) -> Type
}

U0(X: Type): Type {
  return P(P(X))
}

U1(X: Type): Type {
  return (U0(X)) -> X
}

U2(X: Type): Type {
  return (U1(X)) -> U0(X)
}

U: Type = (X: Type) -> U2(X)

tauon(t: P(P(U))): U {
  return (X, f, p) => t((x) => p(f(x(X, f))))
}

sigma(s: U): P(P(U)) {
  return s(U, (t) => tauon(t))
}

delta: P(U) = (y) => Not((p: P(U), _: sigma(y, p)) -> p(tauon(sigma(y))))

omega: U = tauon((p) => (x: U, _: sigma(x, p)) -> p(x))

D: Type = (p: P(U), _: sigma(omega, p)) -> p(tauon(sigma(omega)))

lem1(p: P(U), H1: (x: U, _: sigma(x, p)) -> p(x)): p(omega) {
  return H1(omega, (x) => H1(tauon(sigma(x))))
}

lem2: Not(D) = lem1(delta, (x, H2, H3) => {
  return H3(delta, H2, (p) => H3((y) => p(tauon(sigma(y)))))
})

lem3: D = (p) => lem1((y) => p(tauon(sigma(y))))
```

The checker will run into infinite loop:

``` cicada counterexample
loop: Bottom = lem2(lem3)
```
