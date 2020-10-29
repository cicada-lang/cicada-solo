# [TLT] 3. Eliminate All Natural Numbers!

- 完成：2020-10-29

# lang3 -- 重新实现 cicada-structural-typing

- 完成：2020-10-14

有清晰的推演规则（Inference rules），要能向众人把语言的类型系统的设计讲清楚。

填充类型（Fulfilling type）的推演规则。

支持相互递归函数。
- 通过使用副作用的 Mod API 来实现。
- 需要的时候可以 clone Mod。

# partech -- 将嵌入在 js 中的设计 改为有自己 namespace 的设计

- 完成：2020-10-02

# [TLT] 1. The More Things Change, the More They Stay the Same

- 完成：2020-09-17

# use cicada to specify the inference rules of lang2

- 完成：2020-09-02

# use cicada to specify the inference rules of lang1

- 完成：2020-08-26

# lang2 -- 实现 NbE 教程中的 tartlet。

- 完成：2020-07-13

# lang1 -- 实现 NbE 教程中的 System T。

- 完成：2020-06-28

# lang0 -- 实现 NbE 教程中的 Untyped lambda calculus。

- 完成：2020-06-23

# 首先尝试改 pie 的语法，看看效果。

- 完成：2020-06-11
- 代码举例：
  ``` scheme
  (claim concat (Pi ([E U]) (-> (List E) (List E) (List E))))
  (define concat (lambda (E) (lambda (x y) (rec-List (reverse E y) x (step-reverse E)))))
  ```
  ``` scala
  concat(E: U, List(E), List(E)): List(E)
  concat(E, x, y) = List.rec(reverse(E, y), x, step_reverse(E))
  ```

# 明确模块系统的使用方式。

- 完成：2020-06-07
- 使用类似 Java 和 Scala 的模块系统。
- 由于我想要以 class 或 data 名为相关函数的命名空间，所以我增加如下功能：
  - class 或 data 与命名空间同名时，命名空间可以作为 class 或 data 名。

# 使用更接近目前正在流行的程序语言的语法。

- 完成：2020-06-07
- 即 C 语言家族（Java，JavaScript，Scala）的语法。

# 项目规划与项目管理。

- 完成：2020-06-05
- 在 project 的路径中添加一个 kanban 路径，
  并指定一个文件，给项目管理过程中的每一个阶段（each stage in the process）。
