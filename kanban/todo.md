- lang1 -- syntax suger for natural number.

# lang1 -- Be able to define algebraic data type

# lang3 -- "Computation and Deduction" and Logic framework

- Run datatype definition as logic programs.
- 为古典逻辑设计形式语言。

# 有清晰的推演规则（Inference rules），要能向众人把语言的类型系统的设计讲清楚。

# 有完整的例子来表明语言的设计有效，即使没有语言实现，也可用作形式化数学结构的伪代码。

# lang2 -- 将 NbE 教程中的 tartlet 升级为 pie。

- use cicada to write inference rule as docs.
  - Note that, the language of inference rule does not use closure.

- java like module system.

- multi pi and arrow type
  (_: Nat, _: Nat) -> Nat
  (Nat, Nat) -> Nat

- List
- Vector

- test Equal
- test Pi
- test Absurd

# 用 The Little Typer 作为 Pie 的测试。

- 设计实用的命令行工具与测试框架。

# Play with systemt

# church-encoding

- church-boolean.cic
- church-numeral-predicates.cle
- church-pair.cic
- 直接用 Church numeral 来实现 Nat，而不用 ADT。
  其语义是迭代函数，也许有有趣的应用
  多了一个关于迭代函数的 API。

# pt -- parsing techniques

- theory of CFG
- intersection grammar
- pt framework
  - example grammar
    ``` js
    exp:
      var: identifier
      fn: "(" identifier ")" "=>" exp
      ap: identifier ("(" exp ")")*
      // or ("(" exp ")") must be named? like exp_in_paren
    ```
- try examples in peg paper in parser generator
- change earley to use ordered choice
- change earley to use intersection
- x in x test
  - S <- "x" S "x" | "x"
- a version of partech that use env

# 归纳类型（Inductive type）的推演规则。

- Only one abstraction away.

# 填充类型（Fulfilling type）的推演规则。

# 我们需要 develop 这个关键词，来在证明时，把更多的信息包含在语境中。

- 明确 develop 这个关键词的语义。

# [formalization] [EWD1240a] A little bit of lattice theory

- 形式化这篇文章，以检验这样形式化是否真的好。
- This paper is about the relation between PartialOrder and Lattice.
- Learn from the story line.

# 形式化 Algebraic structures：https://en.wikipedia.org/wiki/Algebraic_structure

# 形式化 Lattice theory。

# 形式化 Closure system。-- 帮助学习 FCA。

# 形式化 Topology theory。

# 形式化 Category theory。

# 形式化 Group theory。

# 形式化 Category of Groups。

# 形式化 Number theroy：https://en.wikipedia.org/wiki/Number_theory

# 我们需要支持相互递归函数。

- 可以通过使用副作用的 Env API 来实现。
- 需要的时候可以 clone Env。

# 我们需要支持 Inductive type（为 Class 的语义）。

# 我们需要支持 Fulfilling type（为 Data 的语义）。
