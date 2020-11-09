- [lang0] `syntax/grammars/`
- [lang0] `syntax/matchers/`

- [lang3] `syntax/grammars/`
- [lang3] `syntax/matchers/`

- [lang2] `syntax/grammars/`
- [lang2] `syntax/matchers/`

- [lang1] `syntax/grammars/`
- [lang1] `syntax/matchers/`

# TLT

> 强化对类型系统的理解与实现技术。
> - 同时测试 lang2 与 lang3。

- [TLT] 5. Lists, Lists, and More Lists
- [TLT] 6. Precisely How Many?
- [TLT] 7. It All Depends On the Motive
- [TLT] Recess: One Piece at a Time
- [TLT] 8. Pick a Number, Any Number
- [TLT] 9. Double Your Money, Get Twice as Much
- [TLT] 10. It Also Depends On the List
- [TLT] 11. All Lists Are Created Equal
- [TLT] 12. Even Numbers Can Be Odd
- [TLT] 13. Even Haf a Baker's Dozen
- [TLT] 14. There's Safety in Numbers
- [TLT] 15. Imagine That ...
- [TLT] 16. If It's All the Same to You
- [TLT] A. The Way Forward
- [TLT] B. Rules Are Made to Be Spoken

# lang2

> 将 NbE 教程中的 tartlet 升级为 pie

- [lang2] `List`, `List.cons`, `List.null`, `List.rec`
- [lang2] `Vector`
- [lang2] be able to add type annotation to `Exp.fn`

- 如何对某一个类型以及相关的 Exp 作出充分的测试？

- test Equal of lang2.
- test Pi of lang2.
- test Absurd of lang2.

- use native `number` as `Nat`.

- 添加 inductive data type
  - 归纳类型（Inductive type）的推演规则。
    - Only one abstraction away.

# lang3

> module system
> - 让语言更严肃更正式，以鼓励我们写更多的例子。

- [lang3] grammar for `Piece` -- `modpath` and `imports`
- [lang3] `Piece.from_file`
- [lang3] `Piece.pieces_from_directory`
- [lang3] `ModMap.from_pieces`
- [lang3] [maybe] good view of Project on frontend

> syntax
> - 让语言更严易于使用，以鼓励我们写更多的例子。

- [lang3] fix syntax about auto currying -- `f(x, y)` as sugar of `f(x)(y)`

> nested match.

- [lang3] more simple rule about pattern variable

- [lang3] be able to add type annotation to `Exp.fn`
  - we will be able to infer such `fn`
  - which might be needed by `@match`

- [lang3] there might be `@match`
  - which will be direct application of `Exp.case_fn`

> Improve the readback of recursive expression.

- [lang3] We SHOULD NOT `mute_recursive_exp_in_mod` for non recursive `Den`

> 更完整的 dependent + structural type 语言。

- [lang3] `Value.subtype` -- structural cls
- [lang3] `Value.subtype` -- function type

# lang4

> jojo -- to study normal form and recursion.
> - Can be used to play with "Diagonalization and Self-Reference"

- [lang4] be clear about the semantic of "Diagonalization and Self-Reference"
- [lang4] design a normalization algorithm
  - 也比可以用 NbE，也许比一般的 NbE 更复杂。
