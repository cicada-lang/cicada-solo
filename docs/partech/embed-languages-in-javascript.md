# Embed languages in javascript

2020-11-08

## 动机

在尝试设计 partech 的过程中，
我发现，我们总是需要语言有做抽象的能力的，
因此我们需要一个 functional language 来生成 grammar，
这样 grammar 的 DSL 就嵌入在某个一般的 functional language 中了。

当考虑到想要为这个 functional language 实现 module system 的时候，
我觉得可能还是嵌入在 js 中最好。
以 js 为这个 「一般的 functional language」，
重用 js 的 module system。

但是我不想回到 lisp，因为 lisp 没人用。
- 比如与 js 的 ts 相比，clojure 的类型系统发展不起来。

## 设计

- `Exp`, `Stmt`, `Top` -- 可以选择实现
- `*.present`, `*.from_present`
