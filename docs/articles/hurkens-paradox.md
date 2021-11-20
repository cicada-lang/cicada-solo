---
title: Hurkens Paradox
author: Zaoqi
---

Learned from [a agda test](https://github.com/agda/agda/blob/master/test/Succeed/Hurkens.agda).

``` cicada
let Bottom: Type = (A: Type) -> A

function Not(A: Type): Type {
  return (A) -> Bottom
}

function P(A: Type): Type {
  return (A) -> Type
}

function U0(X: Type): Type {
  return P(P(X))
}

function U1(X: Type): Type {
  return (U0(X)) -> X
}

function U2(X: Type): Type {
  return (U1(X)) -> U0(X)
}

let U: Type = (X: Type) -> U2(X)

function tauon(t: P(P(U))): U {
  return (X, f, p) => t((x) => p(f(x(X, f))))
}

function sigma(s: U): P(P(U)) {
  return s(U, (t) => tauon(t))
}

let delta: P(U) = (y) => Not((p: P(U), _: sigma(y, p)) -> p(tauon(sigma(y))))

let omega: U = tauon((p) => (x: U, _: sigma(x, p)) -> p(x))

let D: Type = (p: P(U), _: sigma(omega, p)) -> p(tauon(sigma(omega)))

function lem1(p: P(U), H1: (x: U, _: sigma(x, p)) -> p(x)): p(omega) {
  return H1(omega, (x) => H1(tauon(sigma(x))))
}

let lem2: Not(D) = lem1(delta, (x, H2, H3) => {
  return H3(delta, H2, (p) => H3((y) => p(tauon(sigma(y)))))
})

let lem3: D = (p) => lem1((y) => p(tauon(sigma(y))))
```

The checker will run into infinite loop:

``` cicada counterexample
let loop: Bottom = lem2(lem3)
```
