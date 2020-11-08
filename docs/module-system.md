# 模块系统

- 约束：
  - 模块与文件系统无关，用 @module 挂载文件到 module tree 中。
  - module 只用来形成表达式，而非 first class value，不处理其类型。
  - binding 只能挂在 namespace 上。
    - @datatype 与 @class 是形成 namespace 的例子。
    - 类比文件系统：
      |-----------|-----------|
      | module    | directory |
      | namespace | file      |
      | binding   | content   |
      |-----------|-----------|
  - 只能 @import module 与 namespace，不能 @import 函数。
  - binding 不区分 public 与 private。

- 功能：
  - 同一个 module 中的元素可以相互引用（可能相互递归引用）。
  - 可以用带有 @module lang2 的 dependencies.cic 文件，
    来集中 import 并 re-export lang2 的所有依赖。

- 设计：
  - 每个文件开头要有 `@module <module-path>`。
    - 其中 `<module-path>` 是 `<part>.<part>.<part>` 的结构，比如 `structure.category`。
  - dot 中缀 -- `.`，既用来与 module 形成表达式，也用来取 object 的 field。
