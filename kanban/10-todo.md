# tartlet

- generic Trace instead of Exp.Trace
  - take a repr function as argument
- Exp.evaluate
- Exp.alpha_equal
  - use exception todo error report
- Value.readback
- Normal.readback
- Neutral.readback
- Value.convert
- Ctx
- Exp.infer
- Exp.check
- helper function for error reporting

# pie

# typer

- 设计实用的命令行工具与测试框架。

# learn

- search wikipedia about type subsumption
  - https://homepage.cs.uiowa.edu/~jgmorrs/eecs662s19/notes/Notes-on-subsumption.html
  - https://en.wikipedia.org/wiki/Subtyping#Subsumption

- learn more about type directed partial evaluation.

# Play with systemt

# church-encoding

- support comment in parser
- church-boolean.cic
- church-numeral-predicates.cle
- church-pair.cic
- 直接用 Church numeral 来实现 Nat，而不用 ADT。
  其语义是迭代函数，也许有有趣的应用
  多了一个关于迭代函数的 API。

# pt -- parsing techniques

- for-and-against-pegs-why-we-need-multi-ordered-grammars.pdf
- theory of CFG
- intersection grammar
- pt framework
  - example grammar
    exp:
    - var: identifier
    - fn: "(" identifier ")" "=>" exp
    - ap: identifier ("(" exp ")")*
    // or ("(" exp ")") must be named? like exp_in_paren
- try examples in peg paper in parser generator
- change earley to use ordered choice
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
